# Changelog

All notable changes to Wallet will be documented in this file.

## [1.0.1] — 2026-04

### Fixed
- **Blank window on packaged app.** The dev/prod check used `NODE_ENV`, which is unset in packaged Electron builds, so v1.0.0 tried to load the Vite dev server and showed an empty tray popover. Switched to `!app.isPackaged`, the canonical Electron detection.

### Added (new in v1.0.1 but shipped alongside the fix)
- Local HTTP bridge on `127.0.0.1:9847` with per-device bearer token in `electron-store`. Endpoints: `GET /health`, `GET /cards`, `GET /context?host=…`, `POST /cards/:id`.
- Settings → Browser Extension section exposing the pairing token (show / hide / copy).
- Chrome/Arc/Edge extension (`extension/`) — MV3, floating button on claude.ai, chatgpt.com, gemini.google.com, perplexity.ai, copilot.microsoft.com, with `⌘J` shortcut to inject.

## [1.0.0] — 2026-04

First public release.

### Shipped
- Eight context cards: Identity, Voice, Expertise, Current Work, Audience, Aesthetic, Narrative, Goals
- Ambient injection — auto-detects 16+ AI tools and copies relevant cards to clipboard on app switch
- Manual injection — tap any card to inject just that one
- MCP server — Claude Desktop and Claude Code call `get_card`, `get_all_cards`, and `get_context_for_task` natively
- Onboarding flow with AI suggestions
- Global hotkey: `⌘⇧W` to toggle
- Keyboard-first navigation
- Search across cards
- Dark-mode UI with breathing loader and refined accent colors

### Infra
- Code-signed with Apple Developer ID (hardened runtime)
- Notarized via Apple notarytool
- Auto-updates in the background from GitHub Releases (checked every 4 hours)
- Builds for arm64 + x64 — both distributed as `.dmg` and `.zip`
- GitHub Actions release pipeline — tag push triggers build, sign, notarize, publish
