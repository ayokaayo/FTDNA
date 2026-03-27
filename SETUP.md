# FT DNA — Getting Started

> Clone the repo, open Claude Code, and follow the prompts. That's it.

## Before You Start

Have these ready:

1. **Figma Desktop** installed (not the browser version)
2. **Claude Code** CLI installed
3. **Node.js 18+** (`node --version`)
4. **Figma Personal Access Token** — generate one now so it's ready:
   Figma Desktop → Avatar → Settings → Personal access tokens → Generate new token
   (it starts with `figd_` — copy it, you'll paste it into Claude)

## Setup

```bash
git clone <repo-url>
cd FTDNA
claude
```

Claude detects first run automatically and walks you through:
- Installing dependencies
- Configuring MCP servers (Figma connection)
- Setting up environment variables
- Importing the Figma Desktop Bridge plugin
- Verifying connectivity

## The FT DNA Figma File

All design assets live here — make sure you can access it:
[FT DNA on Figma](https://www.figma.com/design/7J3dSTuOSRlsHBqQ4ohtxI/%F0%9F%A7%AC-FT-DNA?m=auto&t=vFxIpgCjzDr1rSQB-6)

It's in the **Brand** project. All team members have access.

## After Setup

Each session:
1. Open the FT DNA file in Figma Desktop
2. Run the Desktop Bridge plugin: **Plugins → Development → Figma Desktop Bridge**
3. Start Claude Code in the FTDNA directory
4. Work normally — if connection drops, run `npm run mcp:health`

## Troubleshooting

See [`references/mcp-setup-guide.md`](references/mcp-setup-guide.md) for the full setup guide and troubleshooting steps.
