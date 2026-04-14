# Changelog

All notable changes to Wallet will be documented in this file.

## [1.0.3] — 2026-04

### Changed — Onboarding polish
- Onboarding is now built on the Control Center material system: a top chrome bar with an animated step indicator (•••), content cards using cc-shell/cc-icon, and a fixed bottom CTA bar.
- Welcome screen uses a premium 72×72 gradient icon with inset highlights and a soft blue glow shadow, 24px/−0.02em tracking title.
- Identity input now sits inside a cc-shell container (not a bordered glass-input), with the Control Center colored icon chip next to the title.
- Completion screen uses a glowing 72px green success circle with stroke-animated checkmark, card name chips styled as subtle pills.
- Buttons replaced the old purple/cyan gradient pill with an Apple-style solid white-on-dark primary CTA (44px, 12px radius, active:scale 0.98), Skip as a subtle ghost button.
- Removed leftover gradient-text / gradient-btn usage from Onboarding.

## [1.0.2] — 2026-04

### Changed — Control Center UI refresh
- Window now uses native macOS `under-window` vibrancy + `transparent: true` so the popover blurs your desktop instead of drawing a solid `#090A11`.
- Widened the popover from 320×520 → 340×580 for proper breathing room.
- Outer window corners rounded to 20px with a hairline inset border (matches Control Center / Focus modes panel).
- CardTray is now a 2-column grid of chunky 14px-radius cells with filled colored icon circles (per-card accent) and tight label / status hierarchy — not a thin list of rows.
- Header is now a "chrome bar": Wallet wordmark + filled/8 count on the left, pill icon buttons for search + settings on the right.
- Context Engine moved from a mono-text footer into a Control Center-style status cell with a pulsing accent dot.
- CardDetail and Settings headers match the same chrome bar.
- Settings cards use the new `cc-shell` material (translucent tile with hairline) instead of the darker solid `glass`.

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
