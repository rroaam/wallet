# Wallet

**Your AI tools will just know you.**

Personal AI context layer for macOS. Lives in your menu bar. Stores 8 context cards about who you are and auto-injects them into Claude, ChatGPT, Cursor, Figma, and any AI tool you open.

Stop re-explaining yourself to every chatbot.

→ **[Download the latest release](https://github.com/rroaam/wallet/releases/latest)** · [wallet.r0am.ai](https://wallet.r0am.ai)

## The 8 cards

Identity · Voice · Expertise · Current Work · Audience · Aesthetic · Narrative · Goals

Fill them once. Wallet keeps them on your Mac, in your menu bar, ready to go.

## Three injection channels

- **Ambient** — Wallet detects the AI tool you switch into and silently puts the right cards on your clipboard. Paste and go.
- **Manual** — Tap any card to inject just that one.
- **MCP** — Claude Desktop and Claude Code call Wallet natively via the Model Context Protocol. No clipboard at all.

## Install

1. Download `Wallet-<version>-arm64.dmg` (Apple Silicon) or `Wallet-<version>.dmg` (Intel) from the [latest release](https://github.com/rroaam/wallet/releases/latest)
2. Drag to Applications
3. Launch Wallet — it lives in your menu bar
4. Complete onboarding and fill in the cards you care about

Wallet is code-signed by Apple and notarized. It auto-updates in the background from GitHub Releases.

## MCP setup

Add this to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "wallet": {
      "command": "node",
      "args": ["/Applications/Wallet.app/Contents/Resources/mcp-server/index.js"]
    }
  }
}
```

Restart Claude Desktop. The `get_card`, `get_all_cards`, and `get_context_for_task` tools become available.

## Privacy

Wallet is free and open source. It runs entirely on your Mac. No accounts. No servers. No telemetry. Your cards never leave your machine.

## Development

```bash
npm install
npm run dev
```

Built with Electron 33, React 19, Tailwind CSS 4, TypeScript strict, `electron-store` for local persistence, `electron-updater` for background updates, and the `@modelcontextprotocol/sdk` for native Claude integration.

### Release

Releases are cut from a tag push. The `.github/workflows/release.yml` workflow imports the signing cert, builds for arm64 + x64, signs with the Developer ID, notarizes via Apple's notarytool, and publishes the `.dmg` + `.zip` + blockmaps + `latest-mac.yml` to GitHub Releases.

```bash
# Dry-run the full signing pipeline without publishing
gh workflow run release.yml --ref main -f publish=never

# Cut a real release
git tag v1.0.1
git push origin v1.0.1
```
