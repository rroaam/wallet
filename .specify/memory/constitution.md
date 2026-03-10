<!--
Sync Impact Report
Version change: 0.0.0 → 1.0.0
Added sections: All (initial constitution)
Templates requiring updates: ✅ spec-template (compatible) | ✅ plan-template (compatible) | ✅ tasks-template (compatible)
Follow-up TODOs: None
-->

# Wallet Constitution

## Core Principles

### I. Context Is Identity

Every person has a persistent context — who they are, how they speak, what they know, what they're building, who they serve. Wallet treats this context as a first-class data type, not an afterthought. Cards are atomic, portable identity units. If a feature doesn't serve the goal of "never explain yourself twice," it doesn't ship.

### II. Invisible Until Useful

Wallet MUST be ambient. It lives in the menu bar, not the dock. It injects context without interrupting flow. The best interaction is the one the user never notices — their AI tool just *knows* them. Zero-click value is the north star. Every manual step we add is a design failure to revisit.

### III. Opinionated, Not Configurable

Wallet ships 8 cards. Not 7, not 20. The card taxonomy is curated, not user-defined. AI tools are better when they're opinionated — blank canvases produce blank output. We make strong defaults and only open configuration where user intent genuinely varies (card content, not card structure).

### IV. Ship Fast, Ship Small

Solo founder, limited time. Every feature MUST be scoped to ship in one session. No multi-week epics. No speculative infrastructure. If it doesn't move the beta closer to 50 users, it waits. Progressive enhancement over premature perfection.

### V. Dark, Dense, Designed

The UI is dark-mode only, glass surfaces, purple-cyan gradients. Brutalist accents with editorial typography. References: Linear, Arc Browser, Teenage Engineering. Generous whitespace. No AI slop. Every pixel is intentional. If it looks like a default Electron app, it's wrong.

### VI. Three Injection Channels, One Truth

Ambient (clipboard on app switch), Manual (explicit inject), and MCP (native tool calls) are the three ways context reaches AI tools. All three read from the same card store. No channel gets stale data. No channel has cards the others don't.

## Design Constraints

- macOS menu bar app (Electron + React + Tailwind). No web app. No login screen.
- 8 fixed cards: Identity, Voice, Expertise, Current Work, Audience, Aesthetic, Narrative, Goals.
- Local-first persistence (electron-store). No cloud sync in v1.
- 320×520px popup window. Tight real estate — every element must earn its space.
- Template images for tray icon. Frame-less popup anchored to tray.
- Context engine polls active app via osascript every 2 seconds.

## Quality Standards

- TypeScript strict mode, no `any` types in committed code.
- Tailwind v4 design tokens via @theme — no hardcoded hex values in components.
- All IPC calls through typed preload bridge — no direct node integration in renderer.
- Components MUST work at 320px width. No horizontal scroll. No overflow.
- Animations MUST be <200ms and interruptible. No blocking transitions.

## Governance

This constitution governs all Wallet development decisions. When scope conflicts arise, principles are evaluated in order (I > II > III > IV > V > VI). Amendments require explicit rationale and version bump.

**Version**: 1.0.0 | **Ratified**: 2026-03-09 | **Last Amended**: 2026-03-09
