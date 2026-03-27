#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────
# mcp-health.sh — Figma Console MCP connection health check
#
# Kills zombie figma-console-mcp processes, cleans stale port
# files, and reports connection status. Designed to run on
# session start (via Claude Code hook) or manually.
#
# Usage:
#   ./scripts/mcp-health.sh          # full cleanup + status
#   ./scripts/mcp-health.sh --quiet  # cleanup only, no output unless problems found
#   ./scripts/mcp-health.sh --status # status only, no cleanup
# ──────────────────────────────────────────────────────────────
set -euo pipefail

PORT_MIN=9223
PORT_MAX=9232
STALE_SECONDS=300  # 5 minutes — matches HEARTBEAT_STALE_MS in port-discovery.ts
QUIET=false
STATUS_ONLY=false

for arg in "$@"; do
  case "$arg" in
    --quiet|-q) QUIET=true ;;
    --status|-s) STATUS_ONLY=true ;;
  esac
done

# Colors (only if terminal supports it)
if [[ -t 1 ]]; then
  RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[0;33m'; CYAN='\033[0;36m'; NC='\033[0m'
else
  RED=''; GREEN=''; YELLOW=''; CYAN=''; NC=''
fi

zombies_killed=0
port_files_cleaned=0
problems=()

# ── Step 1: Find all figma-console-mcp processes ────────────
get_mcp_pids() {
  pgrep -f "figma-console-mcp.*local\.js" 2>/dev/null || true
}

# ── Step 2: Identify which PID owns the current Claude session ──
# The current session's MCP process is the one whose parent is
# THIS shell's ancestor (Claude Code). We protect it from cleanup.
# If run from a hook, PPID chain leads back to Claude Code.
find_current_session_pid() {
  # Find the MCP process attached to current terminal (if any)
  local tty
  tty=$(tty 2>/dev/null | sed 's|/dev/||' || true)
  if [[ -n "$tty" && "$tty" != "not a tty" ]]; then
    ps -eo pid,tty,command 2>/dev/null | grep "$tty" | grep "figma-console-mcp" | grep "local.js" | awk '{print $1}' | head -1
  fi
}

# ── Step 3: Kill zombies ────────────────────────────────────
cleanup_zombies() {
  local current_pid
  current_pid=$(find_current_session_pid)
  local all_pids
  all_pids=$(get_mcp_pids)

  if [[ -z "$all_pids" ]]; then
    return
  fi

  local now
  now=$(date +%s)

  for pid in $all_pids; do
    # Never kill the current session's process
    if [[ -n "$current_pid" && "$pid" == "$current_pid" ]]; then
      continue
    fi

    # Check if this process has an active port file with a fresh heartbeat
    local is_active=false
    for port in $(seq $PORT_MIN $PORT_MAX); do
      # Check both /tmp and $TMPDIR locations (macOS TMPDIR mismatch bug)
      for dir in "/tmp" "${TMPDIR:-/tmp}"; do
        local port_file="${dir}/figma-console-mcp-${port}.json"
        if [[ -f "$port_file" ]]; then
          local file_pid
          file_pid=$(python3 -c "import json; print(json.load(open('$port_file')).get('pid',''))" 2>/dev/null || true)
          if [[ "$file_pid" == "$pid" ]]; then
            # Check heartbeat freshness
            local last_seen
            last_seen=$(python3 -c "
import json, datetime
d = json.load(open('$port_file'))
ls = d.get('lastSeen', d.get('startedAt', ''))
if ls:
    ts = datetime.datetime.fromisoformat(ls.replace('Z', '+00:00')).timestamp()
    print(int(ts))
else:
    print(0)
" 2>/dev/null || echo "0")
            local age=$((now - last_seen))
            if [[ $age -lt $STALE_SECONDS ]]; then
              is_active=true
              break 2
            fi
          fi
        fi
      done
    done

    if [[ "$is_active" == "false" ]]; then
      # Check if the process is attached to an active terminal session
      local proc_tty
      proc_tty=$(ps -p "$pid" -o tty= 2>/dev/null || true)
      # If attached to a terminal with an active shell, it might be in use
      # But if heartbeat is stale, it's a zombie regardless
      kill -TERM "$pid" 2>/dev/null && {
        zombies_killed=$((zombies_killed + 1))
      } || true
    fi
  done

  # Brief pause for port release
  if [[ $zombies_killed -gt 0 ]]; then
    sleep 0.5
  fi
}

# ── Step 4: Clean stale port files from BOTH locations ──────
cleanup_port_files() {
  local now
  now=$(date +%s)

  for dir in "/tmp" "${TMPDIR:-/tmp}"; do
    for port_file in "${dir}"/figma-console-mcp-*.json; do
      [[ -f "$port_file" ]] || continue

      local file_pid
      file_pid=$(python3 -c "import json; print(json.load(open('$port_file')).get('pid',''))" 2>/dev/null || true)

      if [[ -z "$file_pid" ]]; then
        # Corrupt file
        rm -f "$port_file"
        port_files_cleaned=$((port_files_cleaned + 1))
        continue
      fi

      # Check if owning process is alive
      if ! kill -0 "$file_pid" 2>/dev/null; then
        rm -f "$port_file"
        port_files_cleaned=$((port_files_cleaned + 1))
      fi
    done
  done
}

# ── Step 5: Report connection status ────────────────────────
report_status() {
  local active_ports=0
  local connected_ports=0
  local port_list=""

  for port in $(seq $PORT_MIN $PORT_MAX); do
    if lsof -i ":${port}" -sTCP:LISTEN -t &>/dev/null; then
      active_ports=$((active_ports + 1))
      # Check if Figma Desktop is connected to this port
      if lsof -i ":${port}" -sTCP:ESTABLISHED 2>/dev/null | grep -q "Figma"; then
        connected_ports=$((connected_ports + 1))
        port_list="${port_list} ${port}(ok)"
      else
        port_list="${port_list} ${port}(no-client)"
      fi
    fi
  done

  local free_ports=$((PORT_MAX - PORT_MIN + 1 - active_ports))

  if [[ "$QUIET" == "true" ]]; then
    # Only output if there are problems
    if [[ $connected_ports -eq 0 ]]; then
      echo -e "${RED}MCP: No Figma connection. Open Desktop Bridge plugin.${NC}"
    fi
    if [[ $free_ports -le 2 ]]; then
      echo -e "${YELLOW}MCP: Only ${free_ports} ports free (${active_ports}/10 in use).${NC}"
    fi
  else
    echo ""
    echo -e "${CYAN}╭─ MCP Health Report ─────────────────────────╮${NC}"
    echo -e "${CYAN}│${NC}"

    if [[ $zombies_killed -gt 0 ]]; then
      echo -e "${CYAN}│${NC}  ${GREEN}✓${NC} Killed ${zombies_killed} zombie process(es)"
    fi
    if [[ $port_files_cleaned -gt 0 ]]; then
      echo -e "${CYAN}│${NC}  ${GREEN}✓${NC} Cleaned ${port_files_cleaned} stale port file(s)"
    fi

    echo -e "${CYAN}│${NC}  Ports in use:  ${active_ports}/10 (${free_ports} free)"
    echo -e "${CYAN}│${NC}  Active:       ${port_list:- none}"

    if [[ $connected_ports -gt 0 ]]; then
      echo -e "${CYAN}│${NC}  Figma link:    ${GREEN}connected${NC} (${connected_ports} file(s))"
    else
      echo -e "${CYAN}│${NC}  Figma link:    ${RED}disconnected${NC}"
      echo -e "${CYAN}│${NC}"
      echo -e "${CYAN}│${NC}  ${YELLOW}→ Open Figma Desktop Bridge plugin${NC}"
      echo -e "${CYAN}│${NC}  ${YELLOW}  Plugins → Development → Figma Desktop Bridge${NC}"
    fi

    echo -e "${CYAN}│${NC}"
    echo -e "${CYAN}╰──────────────────────────────────────────────╯${NC}"
    echo ""
  fi
}

# ── Step 0: Check first-run prerequisites ────────────────────
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
setup_needed=false

if [[ ! -f "${REPO_ROOT}/.mcp.json" ]]; then
  echo "SETUP_NEEDED: .mcp.json not found. Run first-time setup."
  setup_needed=true
fi

if [[ ! -f "${REPO_ROOT}/.env" ]]; then
  echo "SETUP_NEEDED: .env not found. Run first-time setup."
  setup_needed=true
fi

if [[ ! -d "${REPO_ROOT}/node_modules" ]]; then
  echo "SETUP_NEEDED: node_modules not found. Run npm install."
  setup_needed=true
fi

# If no MCP config exists, skip cleanup (nothing to clean)
if [[ "$setup_needed" == "true" && "$QUIET" == "true" ]]; then
  exit 0
fi

# ── Main ────────────────────────────────────────────────────
if [[ "$STATUS_ONLY" == "false" ]]; then
  cleanup_zombies
  cleanup_port_files
fi
report_status
