# FT DNA — Getting Started

> Clone the repo, open Claude Code, and follow the prompts. Setup takes about 5 minutes.

## Before You Start

Have these ready:

1. **Claude Code** CLI installed (or Cowork desktop app)
2. **Node.js 18+** (`node --version`)
3. **Figma account** with edit access to the FT DNA file (not a dev seat)
4. **Figma Personal Access Token** — generate one now so it's ready:
   Figma Desktop > Avatar > Settings > Personal access tokens > Generate new token
   (starts with `figd_` — copy it, you'll paste it into Claude)
5. **Figma Desktop** app (optional — needed for screenshots and Desktop Bridge tools, not required for read/write)
6. **backoffice-v2 repo** (optional — needed for coded prototype generation):
   ```bash
   git clone <backoffice-v2-repo-url> ../backoffice-v2
   ```
   Must be a sibling directory to FTDNA.

## Setup

```bash
git clone https://github.com/ayokaayo/FTDNA.git
cd FTDNA
claude
```

Claude detects first run automatically and walks you through:

1. Installing dependencies (`npm install`)
2. Creating `.env` from the example (GitBook token is pre-configured)
3. Asking for your Figma token and writing `.mcp.json`
4. Running a health check to verify MCP connectivity

After setup completes, Claude shows you a menu of everything you can do.

### Manual Setup (if auto-setup doesn't complete)

```bash
npm install
cp .env.example .env
cp .mcp.json.example .mcp.json
# Edit .mcp.json — replace YOUR_TOKEN_HERE with your figd_ token
npm run mcp:health
```

### Desktop Bridge Plugin (optional)

Enables screenshots, console monitoring, and granular Figma inspection:

1. `npm install -g figma-console-mcp`
2. Figma Desktop > Plugins > Development > Import plugin from manifest...
3. Select `~/.figma-console-mcp/plugin/manifest.json`

### Figma Remote MCP Authorization

First time you use a Figma read/write tool, a browser window opens for OAuth. Log in and authorize. This persists across sessions.

**Note:** You may need to restart Claude Code (`/quit` then `claude`) after setup for MCP servers to activate.

## The FT DNA Figma File

All design assets live here — make sure you can access it before starting:

[Open FT DNA in Figma](https://www.figma.com/design/7J3dSTuOSRlsHBqQ4ohtxI/%F0%9F%A7%AC-FT-DNA?m=auto&t=vFxIpgCjzDr1rSQB-6)

It's in the **Brand** project. All team members have access.

## Daily Workflow

```
1. Open Figma Desktop + FT DNA file (if using Desktop Bridge)
2. Run Desktop Bridge plugin (green dot = connected)
3. Start Claude Code in the FTDNA directory
4. Health check runs automatically on session start
5. If connection drops mid-session: npm run mcp:health
```

## What You Can Do Once Setup Is Complete

Just describe what you need in natural language. Some examples:

- "Build a segments list page" — generates a Figma prototype
- "Code this page as a prototype" — creates a Vue prototype on Cloudflare Pages
- "Review this screen" — structured design critique
- "How do triggers work?" — searches the FastTrack knowledgebase
- "Teach me about lifecycles" — starts an adaptive tutoring session
- "Write a PRD for feature X" — generates a product requirements doc

See [README.md](README.md) for the full capability list and all available commands.

## Troubleshooting

### MCP servers not appearing

Restart Claude Code after adding `.mcp.json`. Servers load at startup.

### "Cannot connect to Figma Desktop"

Recovery ladder (try in order):

1. `npm run mcp:health` — kills zombies, cleans port files
2. Close and reopen the Desktop Bridge plugin in Figma
3. Check for zombie processes: `lsof -i :9223-9232`
4. Update: `npm install -g figma-console-mcp@latest`
5. Last resort: kill all MCP processes, restart Figma Desktop, restart Claude Code

### Token expired

Figma tokens expire after 90 days. Generate a new one, update `.mcp.json`, restart Claude Code.

### Full reference

See [`references/mcp-setup-guide.md`](references/mcp-setup-guide.md) for multi-user rules, rate limits, port exhaustion, and advanced configuration.
