# Quickstart: Wallet v1 Beta

## Prerequisites

- macOS 12+ (Monterey or later)
- Node.js 20+
- npm 9+

## Install & Run

```bash
cd ~/dev/wallet
npm install

# Development (Vite hot reload + Electron)
npm run dev

# Or run separately:
npx vite              # Terminal 1: renderer dev server
npx electron .        # Terminal 2: Electron main process
```

## What You'll See

1. A small "W" icon appears in your menu bar (top right, near clock)
2. Click it to open the 320×520 Wallet popup
3. On first launch, you'll see the onboarding flow
4. After onboarding, you'll see 8 cards with mock content
5. Click any card to view details, tap edit to modify content
6. Use the "Inject" button to copy a card to clipboard

## Context Engine

The app watches which application is in the foreground. When you switch to an AI tool (Claude, ChatGPT, Cursor, etc.), relevant cards are automatically copied to your clipboard.

## MCP Server Setup

To use Wallet with Claude Desktop natively:

```bash
# Build the MCP server
cd mcp-server && npm install && npx tsc

# Add to Claude Desktop config (~/.config/claude/claude_desktop_config.json):
{
  "mcpServers": {
    "wallet": {
      "command": "node",
      "args": ["/Users/YOU/dev/wallet/mcp-server/index.js"]
    }
  }
}
```

Restart Claude Desktop. You can now ask Claude to use your Wallet context directly.

## Build for Distribution

```bash
npm run build      # Compile renderer + main
npm run package    # Create .dmg via electron-builder
```

## Project Structure

```
src/main/       → Electron main process (Tray, IPC, context engine)
src/renderer/   → React UI (card tray, detail, editor, onboarding)
mcp-server/     → Standalone MCP server for Claude Desktop
assets/         → Tray icon
swift/          → Preserved Swift source for future native port
```
