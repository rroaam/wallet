# Tasks: Wallet v1 Beta — Complete UX Flows

**Input**: Design documents from `/specs/001-wallet-v1-ux/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: Verify existing project compiles and runs correctly

- [ ] T001 Verify main process compiles cleanly with `npx tsc -p tsconfig.main.json`
- [ ] T002 Verify renderer builds with `npx vite build`
- [ ] T003 Verify Electron launches with tray icon visible in menu bar
- [ ] T004 [P] Add `stop-context-engine` IPC handler in `src/main/index.ts` for settings toggle
- [ ] T005 [P] Add `get-active-app` IPC handler in `src/main/index.ts` to expose detected app to renderer

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core UI infrastructure that all user stories depend on

**CRITICAL**: No user story work can begin until this phase is complete

- [ ] T006 Create view routing system in `src/renderer/App.tsx` — support views: onboarding, tray, detail, editor, settings
- [ ] T007 Add slide transition animations between views in `src/renderer/App.tsx` (<200ms, interruptible)
- [ ] T008 [P] Add `onboarding` IPC methods to `src/renderer/types.d.ts` and `src/main/preload.ts` — expose `getOnboardingComplete`, `setOnboardingComplete`
- [ ] T009 [P] Add `stopContextEngine` and `getActiveApp` to `window.wallet` bridge in `src/main/preload.ts`
- [ ] T010 Update `src/renderer/hooks/useCards.ts` to listen for `injection` events and expose active app state

**Checkpoint**: App compiles, launches, supports view navigation with transitions

---

## Phase 3: User Story 1 — First Launch & Onboarding (Priority: P1) MVP

**Goal**: New user sees onboarding on first launch, fills Identity card, lands on card tray

**Independent Test**: Clear electron-store data, launch app, complete onboarding, verify Identity card saved

### Implementation

- [ ] T011 [US1] Create `src/renderer/components/Onboarding.tsx` — 3-screen flow: value prop → Identity card editor → completion
- [ ] T012 [US1] Build onboarding screen 1: hero text "Your AI tools will just know you", subtext explaining Wallet, "Get Started" button
- [ ] T013 [US1] Build onboarding screen 2: Identity card editor with prompt hint "Who are you? What do you do? What makes you different?"
- [ ] T014 [US1] Build onboarding screen 3: completion confirmation "You're set up" with "Open Wallet" CTA
- [ ] T015 [US1] Wire onboarding gate in `src/renderer/App.tsx` — check `getOnboardingComplete()` on mount, show Onboarding or CardTray
- [ ] T016 [US1] Persist onboarding state — call `setOnboardingComplete()` after screen 3, store Identity card content via `updateCard`
- [ ] T017 [US1] Style onboarding with glass surfaces, gradient accents, wallet design tokens in `src/renderer/styles/globals.css`

**Checkpoint**: Fresh install → onboarding → Identity card saved → tray visible

---

## Phase 4: User Story 2 — Browsing the Card Tray (Priority: P1)

**Goal**: All 8 cards visible in scrollable list with icons, names, summaries, active indicators

**Independent Test**: Open tray with mock data, verify all 8 cards render, scroll works, active dots pulse

### Implementation

- [ ] T018 [P] [US2] Polish `src/renderer/components/CardTray.tsx` — header with "WALLET" label, scrollable card list, footer with status
- [ ] T019 [P] [US2] Polish `src/renderer/components/CardRow.tsx` — 52px row: icon, name, summary truncation, 2-letter tag, active dot
- [ ] T020 [US2] Implement pulsing cyan dot animation in `src/renderer/components/CardRow.tsx` — CSS keyframe, visible when `isActive=true`
- [ ] T021 [US2] Build tray footer in `src/renderer/components/CardTray.tsx` — green dot + "CONTEXT ACTIVE" label + gear icon
- [ ] T022 [US2] Wire footer gear icon to navigate to Settings view
- [ ] T023 [US2] Ensure all 8 card icons render correctly in `src/renderer/components/CardIcon.tsx` at 20×20px

**Checkpoint**: Tray shows all 8 cards, scroll works, active indicators pulse, footer shows status

---

## Phase 5: User Story 3 — Viewing Card Detail (Priority: P1)

**Goal**: Tap a card row to see full content, metadata, and inject button

**Independent Test**: Click a card row, verify detail view with full content, back navigation works

### Implementation

- [ ] T024 [P] [US3] Polish `src/renderer/components/CardDetail.tsx` — back arrow, card icon + name header, full content area
- [ ] T025 [US3] Add metadata section to CardDetail — "Last injected: [timestamp/Never]" and "Surfaces when: [app list from CARD_META]"
- [ ] T026 [US3] Style the inject button with gradient border (purple → cyan) in `src/renderer/components/CardDetail.tsx`
- [ ] T027 [US3] Wire back navigation from detail to tray with scroll position preserved
- [ ] T028 [US3] Handle empty card state — show hint "Tap edit to add your context" when content is empty

**Checkpoint**: Card row click → detail view → full content visible → back to tray

---

## Phase 6: User Story 4 — Editing a Card (Priority: P1)

**Goal**: Edit card content with prompt hints, character counter, save persistence

**Independent Test**: Open card detail, tap edit, modify content, save, verify persistence across app restart

### Implementation

- [ ] T029 [P] [US4] Polish `src/renderer/components/CardEditor.tsx` — textarea, prompt hint, character counter, save button
- [ ] T030 [US4] Add per-card prompt hints in `src/shared/constants.ts` CARD_META — unique placeholder text for each of 8 card types
- [ ] T031 [US4] Wire character counter showing `current/2000` with warning color at 90%+ in `src/renderer/components/CardEditor.tsx`
- [ ] T032 [US4] Wire save action — call `updateCard`, navigate back to detail view with updated content
- [ ] T033 [US4] Add unsaved changes guard — confirm dialog on back navigation if content was modified
- [ ] T034 [US4] Wire "AI Suggest" chip in `src/renderer/components/CardEditor.tsx` — placeholder action (logs intent, actual API integration deferred)

**Checkpoint**: Edit any card → save → content persists → summary updates in tray

---

## Phase 7: User Story 5 — Manual Card Injection (Priority: P1)

**Goal**: Inject button copies formatted context block to clipboard

**Independent Test**: Tap inject on any card, paste in text editor, verify [WALLET CONTEXT] block format

### Implementation

- [ ] T035 [US5] Wire inject button in `src/renderer/components/CardDetail.tsx` to call `injectCard(cardId)` via IPC
- [ ] T036 [US5] Verify clipboard format in `src/main/injection.ts` — `[WALLET CONTEXT]\nIDENTITY: ...\n[/WALLET CONTEXT]`
- [ ] T037 [US5] Update card state after injection — set `isActive=true`, update `lastInjected`, notify renderer via `cards-updated`
- [ ] T038 [US5] Disable inject button for cards with empty content — show tooltip "Add content first"
- [ ] T039 [US5] Add subtle inject success feedback in detail view — brief flash or checkmark animation

**Checkpoint**: Inject → paste in any app → correctly formatted context block appears

---

## Phase 8: User Story 6 — Ambient Auto-Injection (Priority: P2)

**Goal**: Automatic clipboard injection when switching to a recognized AI app

**Independent Test**: Switch from Finder to Claude Desktop, verify clipboard contains relevant cards

### Implementation

- [ ] T040 [US6] Verify `src/main/context.ts` correctly polls via osascript and maps bundle IDs to DetectedApp
- [ ] T041 [US6] Verify APP_CARD_MAP in `src/main/constants.ts` returns correct card sets per app
- [ ] T042 [US6] Wire context engine callback in `src/main/index.ts` — filter empty cards, format, write to clipboard
- [ ] T043 [US6] Send `injection` event to renderer with cardIds, app name, and timestamp
- [ ] T044 [US6] Add ambient injection visual feedback — show injection event in tray footer temporarily

**Checkpoint**: Switch to Claude → clipboard has relevant cards → tray shows active indicators

---

## Phase 9: User Story 7 — MCP Server Integration (Priority: P2)

**Goal**: Claude Desktop can query Wallet cards natively via MCP tool calls

**Independent Test**: Start MCP server, call `get_all_cards`, verify 8 cards returned with current content

### Implementation

- [ ] T045 [P] [US7] Verify `mcp-server/index.ts` — `get_card`, `get_all_cards`, `get_context_for_task` tools registered
- [ ] T046 [US7] Verify `src/main/mcp-bridge.ts` writes `cards.json` to `~/Library/Application Support/Wallet/`
- [ ] T047 [US7] Ensure bridge file updates on every `update-card` and `inject-card` IPC call
- [ ] T048 [US7] Test keyword matching in `get_context_for_task` — verify "write marketing copy" returns voice + audience + identity
- [ ] T049 [US7] Add MCP setup instructions to `specs/001-wallet-v1-ux/quickstart.md`

**Checkpoint**: MCP server running → Claude can call tools → returns current card data

---

## Phase 10: User Story 8 — Inject All Relevant (Priority: P2)

**Goal**: One-click batch injection of all cards relevant to the current app

**Independent Test**: Trigger "inject all relevant" for Claude, verify clipboard has multi-card block

### Implementation

- [ ] T050 [US8] Add "Inject All" button to tray footer or header in `src/renderer/components/CardTray.tsx`
- [ ] T051 [US8] Wire button to call `injectAllRelevant(activeApp)` via IPC
- [ ] T052 [US8] Verify `src/main/injection.ts` formats multiple cards into a single [WALLET CONTEXT] block with card name headers
- [ ] T053 [US8] Show feedback when no relevant cards have content — "Fill out your cards to inject context"
- [ ] T054 [US8] Show active indicators on all injected cards simultaneously for 3 seconds

**Checkpoint**: Click "Inject All" → clipboard has multi-card block → all relevant cards pulse

---

## Phase 11: User Story 9 — Tray State & Visual Feedback (Priority: P2)

**Goal**: Smooth open/close animations, correct tray positioning, injection feedback

**Independent Test**: Open/close tray rapidly, verify no visual glitches; trigger injection while tray is open

### Implementation

- [ ] T055 [US9] Verify tray popup positions correctly below tray icon in `src/main/index.ts` `positionWindow()`
- [ ] T056 [US9] Handle edge case — popup at screen edge should not overflow off-screen
- [ ] T057 [US9] Verify blur-to-dismiss works — click outside popup hides it and sends `tray-state: idle`
- [ ] T058 [US9] Add CSS transitions for view changes in `src/renderer/styles/globals.css` — slide left/right <200ms
- [ ] T059 [US9] Verify injection events update tray in real-time when popup is visible

**Checkpoint**: Tray opens/closes smoothly, positioned correctly, injection feedback visible

---

## Phase 12: User Story 10 — Agentic Identity Use Case (Priority: P3)

**Goal**: Position Wallet as identity infrastructure for AI agents, not just humans

**Independent Test**: Fill cards with agent persona, query MCP, verify context supports consistent agent identity

### Implementation

- [ ] T060 [US10] Add alternate prompt hints for agent personas in card editors — "Describe the agent's voice and communication style"
- [ ] T061 [US10] Verify MCP `get_context_for_task` returns a cohesive identity block suitable for agent consumption
- [ ] T062 [US10] Document the agentic use case in `specs/001-wallet-v1-ux/quickstart.md` — "Using Wallet for AI Agents"

**Checkpoint**: Cards filled with agent persona → MCP returns cohesive identity → documented

---

## Phase 13: User Story 11 — Settings & Preferences (Priority: P3)

**Goal**: Minimal settings panel — context engine toggle and quit

**Independent Test**: Open settings, toggle context engine off, verify ambient injection stops

### Implementation

- [ ] T063 [US11] Create `src/renderer/components/Settings.tsx` — back arrow, "Settings" header, toggle list
- [ ] T064 [US11] Add context engine toggle — calls `stopContextEngine` / `startContextEngine` via IPC
- [ ] T065 [US11] Update footer status text based on engine state — "CONTEXT ACTIVE" vs "CONTEXT PAUSED"
- [ ] T066 [US11] Add "Quit Wallet" button in settings that calls `app.quit()` via IPC
- [ ] T067 [US11] Style settings with consistent dark theme, glass card backgrounds

**Checkpoint**: Settings → toggle engine off → footer shows paused → toggle on → resumes

---

## Phase 14: Polish & Cross-Cutting Concerns

**Purpose**: Refinements that affect multiple stories

- [ ] T068 [P] Verify all components work at 320px width — no horizontal overflow in any view
- [ ] T069 [P] Audit all hardcoded colors — replace with Tailwind @theme tokens from `globals.css`
- [ ] T070 [P] Add scrollbar styling for card tray — thin, dark, auto-hide
- [ ] T071 Verify electron-store data survives app restart — launch, edit card, quit, relaunch, check
- [ ] T072 Verify MCP bridge file stays in sync after multiple rapid card edits
- [ ] T073 [P] Add keyboard shortcut support — Escape to go back, Cmd+Enter to save in editor
- [ ] T074 Run quickstart.md validation — follow all steps on a fresh machine
- [ ] T075 Performance check — verify <100MB memory during normal operation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1
- **Phases 3-7 (P1 Stories)**: Depend on Phase 2 — execute sequentially (US1 → US2 → US3 → US4 → US5)
- **Phases 8-11 (P2 Stories)**: Depend on Phase 2 + P1 stories — can run in parallel with each other
- **Phases 12-13 (P3 Stories)**: Depend on Phase 2 — can run anytime after foundational
- **Phase 14 (Polish)**: Depends on all desired stories being complete

### User Story Dependencies

- **US1 (Onboarding)**: Independent — gates first-launch experience
- **US2 (Card Tray)**: Independent — home screen rendering
- **US3 (Card Detail)**: Depends on US2 (navigates from tray row)
- **US4 (Card Editor)**: Depends on US3 (navigates from detail view)
- **US5 (Manual Inject)**: Depends on US3 (inject button lives in detail)
- **US6 (Ambient Inject)**: Independent of UI stories — main process only
- **US7 (MCP Server)**: Independent — standalone Node.js process
- **US8 (Inject All)**: Depends on US5 (injection infrastructure)
- **US9 (Visual Feedback)**: Depends on US2 + US5 (tray + injection events)
- **US10 (Agentic)**: Depends on US7 (MCP server working)
- **US11 (Settings)**: Independent — new view

### Parallel Opportunities

Within Phase 2: T008, T009 can run in parallel
Within US2: T018, T019 can run in parallel
Within US8: All P2 stories (US6, US7, US8, US9) can proceed in parallel after P1 complete
Within Polish: T068, T069, T070, T073 can all run in parallel

---

## Implementation Strategy

### MVP First (P1 Stories Only)

1. Phase 1: Setup → verify app launches
2. Phase 2: Foundational → view routing + transitions
3. Phase 3: Onboarding → first-launch experience
4. Phase 4: Card Tray → home screen
5. Phase 5: Card Detail → view full card
6. Phase 6: Card Editor → edit cards
7. Phase 7: Manual Inject → core value prop
8. **STOP and VALIDATE**: Can a user fill cards and inject context? Ship if yes.

### Full v1 Beta

9. Phase 8-11: P2 Stories → ambient inject, MCP, batch inject, visual polish
10. Phase 12-13: P3 Stories → agentic positioning, settings
11. Phase 14: Polish → width audit, performance, keyboard shortcuts

---

## Summary

- **Total tasks**: 75
- **Phase 1 (Setup)**: 5 tasks
- **Phase 2 (Foundational)**: 5 tasks
- **P1 Stories (US1-5)**: 35 tasks across 5 phases
- **P2 Stories (US6-9)**: 20 tasks across 4 phases
- **P3 Stories (US10-11)**: 5 tasks across 2 phases
- **Polish**: 8 tasks
- **Parallel opportunities**: 18 tasks marked [P]
- **Suggested MVP scope**: Phases 1-7 (US1 through US5) = 45 tasks
