# Figma MCP Setup Guide — FastTrack Team

> Step-by-step guide for connecting Claude Code to Figma. Follow this once per machine.

## What You Get

Two MCP servers work together:

| Server | What it does | Connection |
|---|---|---|
| **Figma Remote MCP** (official) | Read + write designs (`use_figma`), Code Connect, search | Cloud (Figma's servers) |
| **Figma Console MCP** (Desktop Bridge) | Screenshots, console monitoring, granular inspection tools | Local WebSocket via Figma plugin |

> Figma's official MCP supports write access via `use_figma` (since March 2026). This is the default tool for all build/create operations. The Desktop Bridge is still needed for screenshots, debugging, and single-node inspection — but it's no longer required for writing to the canvas.

## Prerequisites

**Required (for read + write via cloud):**
- **Claude Code** CLI installed
- **Figma account** with full edit access to the FT DNA file (not dev seat)

**Optional (for screenshots + debugging):**
- **Figma Desktop** app (not browser)
- **Node.js** 18+ (`node --version`)

---

## Step 1: Install Figma Console MCP

```bash
npm install -g figma-console-mcp
```

This also installs the Desktop Bridge plugin files to `~/.figma-console-mcp/plugin/`.

## Step 2: Generate a Figma Personal Access Token

1. Open Figma Desktop → click your avatar → **Settings**
2. Scroll to **Personal access tokens**
3. Click **Generate new token**
4. Name it `claude-code` (or your name)
5. Copy the token (starts with `figd_`)

> Tokens expire after 90 days. Set a calendar reminder to regenerate.

## Step 3: Configure the MCP Server

Create/edit the project MCP config at `FTDNA/.mcp.json`:

```json
{
  "mcpServers": {
    "figma-remote-mcp": {
      "type": "http",
      "url": "https://mcp.figma.com/mcp"
    },
    "figma-console-mcp": {
      "command": "npx",
      "args": ["-y", "figma-console-mcp@latest"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "YOUR_TOKEN_HERE",
        "ENABLE_MCP_APPS": "true"
      }
    }
  }
}
```

**Important:** Replace `YOUR_TOKEN_HERE` with your actual token.

> The `.mcp.json` in the repo uses a shared config. If you need a personal token, create your own `~/.mcp.json` at your home directory — it overrides the project-level config.

## Step 4: Import the Desktop Bridge Plugin

1. Open **Figma Desktop**
2. Go to **Plugins → Development → Import plugin from manifest…**
3. Navigate to `~/.figma-console-mcp/plugin/manifest.json`
4. Click **Open**

This only needs to be done once. Figma caches the plugin.

## Step 5: Enable the MCP Servers in Claude Code

Open Claude Code in the FTDNA directory and approve the MCP servers when prompted. Or add them to your `.claude/settings.local.json`:

```json
{
  "enableAllProjectMcpServers": true,
  "enabledMcpjsonServers": ["figma-remote-mcp", "figma-console-mcp"]
}
```

## Step 6: Authenticate Figma Remote MCP

The first time you use a `figma-remote-mcp` tool, it will open a browser window for OAuth. Log in with your Figma account and authorize.

This persists across sessions — you only do it once.

## Step 7: Connect the Desktop Bridge

Each time you start working:

1. Open the FT DNA file in Figma Desktop
2. Run the plugin: **Plugins → Development → Figma Desktop Bridge**
3. The plugin status should show **MCP ready** with a green dot
4. In Claude Code, MCP tools should now be available

---

## Daily Workflow

```
1. Open Figma Desktop + FT DNA file
2. Open Desktop Bridge plugin (green dot = connected)
3. Start Claude Code in the FTDNA directory
4. Health check runs automatically on session start
5. Work normally — if connection drops, run: npm run mcp:health
```

## Troubleshooting

### "Cannot connect to Figma Desktop"

**Recovery ladder** (try in order):

1. **Run health check:** `npm run mcp:health` — kills zombies, cleans port files
2. **Reload the plugin:** In Figma, close and reopen the Desktop Bridge plugin
3. **Check for zombie processes:** `lsof -i :9223-9232` — kill any stale node processes
4. **Update the server:** `npm install -g figma-console-mcp@latest`, re-import the manifest
5. **Nuclear option:** Kill all MCP processes, restart Figma Desktop, restart Claude Code

### Port exhaustion (all 10 ports in use)

The health check script handles this automatically. If it persists:

```bash
# See what's holding ports
lsof -i :9223-9232

# Kill all figma-console-mcp processes
pkill -f "figma-console-mcp.*local.js"

# Clean stale port files
rm -f /tmp/figma-console-mcp-*.json
rm -f ${TMPDIR}figma-console-mcp-*.json
```

### Plugin shows "MCP ready" but tools fail

The plugin may be running a cached old version:
1. Re-import the manifest from `~/.figma-console-mcp/plugin/manifest.json`
2. Close and reopen the Figma file (not just the plugin)

### Sleep/wake disconnection

macOS lid close drops the WebSocket. After waking:
1. Click into the Figma file (reactivates the plugin)
2. If tools still fail, run `npm run mcp:health`

---

## Multi-User Rules

When multiple team members work on the same Figma file:

1. **Each person runs their own independent stack** — no cross-user interference at the MCP level
2. **Avoid concurrent edits to the same node** — Figma uses last-writer-wins (no merge, no warning)
3. **Assign pages/frames** — agree who builds where before starting
4. **Rate limits (Remote MCP only):** 200 calls/day on Organization plan, per user

## Available Commands

```bash
npm run mcp:health    # Full cleanup + connection report
npm run mcp:status    # Status only, no cleanup
```
