# Wallet

Personal AI context layer for macOS. Lives in your menu bar. Stores 8 context cards about you and auto-injects them into Claude, ChatGPT, Cursor, and more.

**Your AI tools will just know you.**

## How it works

1. Fill out 8 context cards: Identity, Voice, Expertise, Current Work, Audience, Aesthetic, Narrative, Goals
2. Wallet detects which app you're using (Claude, ChatGPT, Cursor, Figma, etc.)
3. Relevant cards are automatically copied to your clipboard — paste and go
4. Or use the MCP server for native tool integration with Claude

## Three injection channels

- **Ambient** — auto-injects via clipboard when you switch to an AI app
- **Manual** — tap "Inject Context" on any card
- **MCP** — Claude calls `get_context_for_task` natively, no clipboard needed

## Stack

- Electron 33 + React 19 + Tailwind 4
- Native `Tray` + `BrowserWindow` (no menubar dependency)
- `electron-store` for local persistence
- MCP server via `@modelcontextprotocol/sdk`

## Development

```bash
npm install
npm run dev
```

## MCP Setup

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "wallet": {
      "command": "node",
      "args": ["/path/to/wallet/mcp-server/index.js"]
    }
  }
}
```

Restart Claude Desktop. The `get_card`, `get_all_cards`, and `get_context_for_task` tools will be available.

## Package

```bash
npm run package
```

Produces a `.dmg` in `out/`.
