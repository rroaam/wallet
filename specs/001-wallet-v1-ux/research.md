# Research: Wallet v1 Beta

## Decision 1: Tray Implementation

**Decision**: Native Electron `Tray` + `BrowserWindow` (no third-party `menubar` package)
**Rationale**: The `menubar` npm package caused SIGTRAP crashes with Electron 33. Native Tray gives full control over window positioning, lifecycle, and icon rendering. Fewer dependencies = fewer failure modes.
**Alternatives considered**: `menubar` npm package (crashed), `electron-traywindow-positioner` (unnecessary abstraction over 5 lines of positioning math)

## Decision 2: Module System

**Decision**: Main process uses CommonJS, renderer uses ESM (bundled by Vite)
**Rationale**: Electron's main process loads via `require()`. electron-store v8 is CJS-compatible (v10+ is ESM-only and broke imports). Vite handles ESM bundling for the renderer. Shared types are duplicated in both `src/shared/` and `src/main/` to avoid cross-module-system imports.
**Alternatives considered**: ESM-only with electron-store v10 (import failures), dynamic import workarounds (fragile)

## Decision 3: App Detection Method

**Decision**: osascript polling via `child_process.exec` every 2 seconds
**Rationale**: No native dependencies required. Works on all macOS versions 10.15+. The command `tell application "System Events" to get bundle identifier of first process whose frontmost is true` is reliable and fast (<50ms). 2-second poll interval balances responsiveness with CPU usage.
**Alternatives considered**: Accessibility API via native addon (requires Xcode to build), CGEventTap (requires accessibility permissions prompt), NSWorkspace notifications via native module (requires Swift bridge)

## Decision 4: Persistence

**Decision**: electron-store v8.2.0 with typed schema
**Rationale**: Simple key-value store backed by a JSON file in `~/Library/Application Support/wallet/`. No setup, no migrations, survives app restarts. Type-safe with generics. The 8-card dataset is tiny (<10KB) — no need for SQLite or IndexedDB.
**Alternatives considered**: SQLite via better-sqlite3 (overkill, native dep), lowdb (similar to electron-store but less Electron-native), plain fs writes (no atomic writes, race conditions)

## Decision 5: MCP Bridge Architecture

**Decision**: Main process writes `cards.json` to app support directory; MCP server reads it on each request
**Rationale**: Decoupled architecture — MCP server doesn't need to import Electron or connect via IPC. The bridge file is updated on every card edit and app launch. The MCP server is a standalone Node.js process that can be registered in Claude Desktop's config independently.
**Alternatives considered**: IPC between MCP server and Electron (complex, requires the app to be running), shared SQLite DB (overkill), HTTP API from Electron (port conflicts, firewall issues)

## Decision 6: Onboarding State

**Decision**: Boolean `onboardingComplete` flag in electron-store
**Rationale**: Simple binary state — either onboarding has been completed or it hasn't. No need for step tracking (if user quits mid-onboarding, they restart from the beginning — the flow is <60 seconds). Reset by clearing electron-store.
**Alternatives considered**: Step-by-step progress tracking (over-engineered for a 3-screen flow), localStorage in renderer (not accessible from main process)

## Decision 7: Card Content Formatting

**Decision**: `[WALLET CONTEXT]...[/WALLET CONTEXT]` XML-like block with card headers
**Rationale**: AI models (Claude, GPT) reliably parse XML-like delimiters. The format is human-readable when pasted. Card names serve as section headers. The block is self-contained — no external references needed.
**Alternatives considered**: JSON blob (not human-readable when pasted), Markdown headers (AI models sometimes ignore markdown structure), system prompt format (only works for some tools)

## Decision 8: UI Framework

**Decision**: React 19 with Tailwind v4 (Vite plugin), no component library
**Rationale**: The UI is 6 screens in a 320px popup — a component library adds more weight than value. Tailwind v4's @theme tokens provide the design system. React 19 is the latest stable. Custom components (glass cards, gradient borders, pulsing dots) are more on-brand than any library.
**Alternatives considered**: shadcn/ui (good but adds file count for simple components), Radix (overkill for this scope), vanilla HTML/CSS (loses React's state management benefits for card editing)
