# Implementation Plan: Wallet v1 Beta — Complete UX Flows

**Branch**: `001-wallet-v1-ux` | **Date**: 2026-03-09 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-wallet-v1-ux/spec.md`

## Summary

Wallet is a macOS menu bar app that stores 8 personal AI context cards and delivers them to AI tools via three channels: ambient clipboard injection on app switch, manual single/batch injection, and MCP server tool calls. The v1 beta targets 50 users and covers the complete UX — onboarding, card tray, detail/edit views, all injection methods, and visual feedback. Built with Electron + React 19 + Tailwind v4.

## Technical Context

**Language/Version**: TypeScript 5.7 (strict mode), React 19, Node.js 20+
**Primary Dependencies**: Electron 33, React 19, Tailwind CSS 4.1, Vite 6, electron-store 8.2
**Storage**: electron-store (local JSON file, no cloud, no database)
**Testing**: Manual testing for v1 beta (vitest planned for post-beta)
**Target Platform**: macOS 12+ (Monterey and later), menu bar tray app
**Project Type**: Desktop app (Electron menu bar)
**Performance Goals**: 60fps tray scroll, <2s ambient injection latency, <200ms UI transitions
**Constraints**: <100MB memory, 320×520px popup, offline-only, no login/auth
**Scale/Scope**: 50 beta users, 8 fixed cards, single-user local app

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Context Is Identity | ✅ PASS | All 11 user stories serve the "never explain yourself twice" goal |
| II. Invisible Until Useful | ✅ PASS | Menu bar tray, ambient injection, blur-to-dismiss. No dock icon. |
| III. Opinionated Not Configurable | ✅ PASS | 8 fixed cards, no custom card creation, curated taxonomy |
| IV. Ship Fast Ship Small | ✅ PASS | P1 stories are independently shippable. No multi-week epics. |
| V. Dark Dense Designed | ✅ PASS | Dark-only, glass surfaces, design tokens in Tailwind @theme |
| VI. Three Channels One Truth | ✅ PASS | Ambient, manual, MCP all read from same electron-store |

No violations. Gate passed.

## Project Structure

### Documentation (this feature)

```text
specs/001-wallet-v1-ux/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── ipc-bridge.md    # Renderer ↔ Main IPC contract
│   └── mcp-tools.md     # MCP server tool schemas
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (from /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── main/                    # Electron main process (CommonJS)
│   ├── index.ts             # App entry, Tray, BrowserWindow, IPC handlers
│   ├── context.ts           # osascript app detection engine
│   ├── injection.ts         # Card formatting for clipboard
│   ├── mcp-bridge.ts        # Writes cards.json for MCP server
│   ├── preload.ts           # contextBridge IPC bridge
│   ├── types.ts             # Main process type definitions
│   └── constants.ts         # Card metadata, app mappings
├── renderer/                # React UI (ESM, bundled by Vite)
│   ├── index.html           # Shell HTML
│   ├── main.tsx             # React entry
│   ├── App.tsx              # Root component, view routing
│   ├── components/
│   │   ├── CardTray.tsx     # Home screen — scrollable card list
│   │   ├── CardRow.tsx      # Single card row in tray
│   │   ├── CardDetail.tsx   # Full card view + inject button
│   │   ├── CardEditor.tsx   # Edit card content + AI suggest
│   │   ├── CardIcon.tsx     # Inline SVG icons for 8 card types
│   │   ├── Onboarding.tsx   # First-launch flow (NEW — Story 1)
│   │   └── Settings.tsx     # Context engine toggle, quit (NEW — Story 11)
│   ├── hooks/
│   │   └── useCards.ts      # Card state management + IPC calls
│   ├── styles/
│   │   └── globals.css      # Tailwind v4 @theme tokens, glass, gradients
│   └── types.d.ts           # Window.wallet type declarations
├── shared/                  # Shared type definitions
│   ├── types.ts
│   └── constants.ts
mcp-server/                  # Standalone MCP server (Node.js)
│   ├── index.ts             # 3 tools: get_card, get_all_cards, get_context_for_task
│   ├── package.json
│   └── tsconfig.json
assets/
│   └── trayIconTemplate.png # 16×16 template image for menu bar
swift/                       # Preserved Swift source for future native port
```

**Structure Decision**: Electron desktop app with separate main/renderer processes. Shared types duplicated (not symlinked) due to CJS main process vs ESM renderer bundling. MCP server is a standalone Node.js process that reads from a bridge file written by the main process.

## Complexity Tracking

No constitution violations — no complexity justifications needed.
