# Consistency Analysis: Wallet v1 Spec Kit

**Date**: 2026-03-09
**Scope**: All artifacts in `specs/001-wallet-v1-ux/` cross-referenced against source code
**Status**: Research only — no files were modified

---

## 1. Coverage Matrix: Spec Stories -> Tasks -> Code

| User Story | Priority | Tasks Covering It | Code Files Implementing It | Status |
|---|---|---|---|---|
| US1 — First Launch & Onboarding | P1 | T008, T011-T017 | **Onboarding.tsx: MISSING** | GAP: Component does not exist |
| US2 — Browsing the Card Tray | P1 | T018-T023 | `CardTray.tsx`, `CardRow.tsx`, `CardIcon.tsx` | PARTIAL: Footer gear icon exists but has no click handler wired to Settings (Settings.tsx missing) |
| US3 — Viewing Card Detail | P1 | T024-T028 | `CardDetail.tsx` | PARTIAL: See detail findings below |
| US4 — Editing a Card | P1 | T029-T034 | `CardEditor.tsx` | PARTIAL: See detail findings below |
| US5 — Manual Card Injection | P1 | T035-T039 | `CardDetail.tsx`, `injection.ts`, `index.ts` | PARTIAL: Inject button exists but always says "Inject into Claude" (hardcoded) |
| US6 — Ambient Auto-Injection | P2 | T040-T044 | `context.ts`, `index.ts`, `constants.ts` | MOSTLY COMPLETE: Engine runs, filters empty cards, notifies renderer |
| US7 — MCP Server Integration | P2 | T045-T049 | `mcp-server/index.ts`, `mcp-bridge.ts` | MOSTLY COMPLETE: See MCP findings below |
| US8 — Inject All Relevant | P2 | T050-T054 | `index.ts` (handler exists), `preload.ts` (bridge exists) | GAP: No "Inject All" button in CardTray.tsx UI |
| US9 — Tray State & Visual Feedback | P2 | T055-T059 | `index.ts` (positionWindow), `CardRow.tsx` (active dot) | PARTIAL: Active dot exists, no edge-of-screen guard |
| US10 — Agentic Identity Use Case | P3 | T060-T062 | N/A (documentation + prompt hints) | NOT STARTED |
| US11 — Settings & Preferences | P3 | T063-T067 | **Settings.tsx: MISSING** | GAP: Component does not exist |

### Story-to-Task Coverage Verdict

Every user story (US1-US11) has corresponding tasks in `tasks.md`. Coverage is complete at the spec/task level. The gaps are at the task-to-code level: several tasks have not yet been implemented.

---

## 2. IPC Contract Alignment: Contract vs Actual Code

### Invoke Channels

| Channel (Contract) | preload.ts | index.ts Handler | types.d.ts | Status |
|---|---|---|---|---|
| `get-cards` | `getCards()` | `ipcMain.handle("get-cards")` | `getCards: () => Promise<WalletCard[]>` | ALIGNED |
| `update-card` | `updateCard(card)` | `ipcMain.handle("update-card")` | `updateCard: (card: WalletCard) => Promise<WalletCard[]>` | ALIGNED |
| `inject-card` | `injectCard(cardId)` | `ipcMain.handle("inject-card")` | `injectCard: (cardId: CardID) => Promise<WalletCard[]>` | ALIGNED |
| `inject-all-relevant` | `injectAllRelevant(app)` | `ipcMain.handle("inject-all-relevant")` | `injectAllRelevant: (app: string) => Promise<WalletCard[]>` | ALIGNED |
| `get-onboarding-complete` | `getOnboardingComplete()` | `ipcMain.handle("get-onboarding-complete")` | `getOnboardingComplete: () => Promise<boolean>` | ALIGNED |
| `set-onboarding-complete` | `setOnboardingComplete()` | `ipcMain.handle("set-onboarding-complete")` | `setOnboardingComplete: () => Promise<boolean>` | ALIGNED |

### Event Channels

| Channel (Contract) | preload.ts Listener | index.ts Sender | types.d.ts | Status |
|---|---|---|---|---|
| `cards-updated` | `onCardsUpdated(cb)` | `win.webContents.send("cards-updated", ...)` | `onCardsUpdated: (cb) => () => void` | ALIGNED |
| `injection` | `onInjection(cb)` | `win.webContents.send("injection", ...)` | `onInjection: (cb) => () => void` | ALIGNED |
| `tray-state` | `onTrayState(cb)` | `win.webContents.send("tray-state", ...)` | `onTrayState: (cb) => () => void` | ALIGNED |

### IPC Contract Gaps

| # | Gap | Details |
|---|---|---|
| IPC-1 | **Missing `stop-context-engine` handler** | Contract does not define it, but Task T004 and T009 require `stopContextEngine` in preload. The function `stopContextEngine()` exists in `context.ts` but is never imported or registered as an IPC handler in `index.ts`. The preload does not expose it. `types.d.ts` does not declare it. |
| IPC-2 | **Missing `get-active-app` handler** | Task T005 requires exposing detected app to renderer. No IPC handler exists. Not in preload, not in types.d.ts. |
| IPC-3 | **Missing `start-context-engine` handler** | Task T064 (Settings toggle) needs both start and stop. Neither is wired. |
| IPC-4 | **`any` types in preload.ts** | Constitution quality standard says "no `any` types in committed code." `preload.ts` uses `any` for `updateCard(card: any)`, `onInjection(cb: (data: any) => void)`, and `onCardsUpdated(cb: (cards: any[]) => void)`. Three violations. |
| IPC-5 | **`inject-all-relevant` side effects incomplete** | Contract says it should update `isActive` and `lastInjected` on injected cards. The actual handler in `index.ts` (line 267-280) copies to clipboard but does NOT update `isActive`, `lastInjected`, or send `cards-updated` / `injection` events. |

---

## 3. MCP Contract Alignment: Contract vs Actual mcp-server/index.ts

### Tool Registration

| Tool (Contract) | Registered in Code | Input Schema Match | Status |
|---|---|---|---|
| `get_card` | Yes (line 98) | ALIGNED: `card_id` string enum with all 8 IDs | ALIGNED |
| `get_all_cards` | Yes (line 122) | ALIGNED: empty object | ALIGNED |
| `get_context_for_task` | Yes (line 132) | DEVIATION: see below | PARTIAL |

### `get_context_for_task` Deviations

| # | Aspect | Contract Says | Code Does | Severity |
|---|---|---|---|---|
| MCP-1 | **Input parameter name** | `task_description` | `task` | MEDIUM — Contract says `task_description`, code schema says `task`. Any consumer following the contract would send the wrong parameter name. |
| MCP-2 | **Extra parameter** | Not mentioned | `app_context` (optional string) | LOW — Extra parameter not in contract. The code declares it in the schema but never reads it in `getRelevantCards()`. Dead parameter. |
| MCP-3 | **Keyword mappings differ** | Contract lists: "write/copy/email/message -> voice" and "code/build/develop/debug -> expertise, currentWork" etc. | Code uses different regex: "write/email/post/copy/caption -> voice, identity, audience" and "design/figma/visual/ui/ux/aesthetic -> aesthetic, currentWork" etc. | MEDIUM — The actual keyword sets and resulting card selections differ from the contract. |
| MCP-4 | **Identity card always included** | Contract: "Always includes the Identity card as baseline context" | Code: Identity is NOT always included. Only appears in the regex match results, not as a guaranteed baseline. | MEDIUM — Spec promise broken. If task matches "plan/strategy", code returns `goals + currentWork` without identity. |

### `get_all_cards` Output Format Deviation

| # | Contract Says | Code Does | Severity |
|---|---|---|---|
| MCP-5 | "Formatted text block with all 8 cards, each with name header and content. Empty cards marked as '(not yet filled)'" | Returns JSON array of `{id, name, summary}` objects — no content field, no text block format, no "(not yet filled)" marker | HIGH — Output format is completely different from contract. Contract promises formatted text with full content; code returns JSON summaries only. |

### Bridge File Format Deviation

| # | Contract Says | Code Does | Severity |
|---|---|---|---|
| MCP-6 | Bridge file wraps cards in `{ "cards": [...], "updatedAt": "..." }` | `syncCardsForMCP()` writes bare `WalletCard[]` array (no wrapper object, no top-level `updatedAt`) | HIGH — MCP server's `loadCards()` does `JSON.parse(raw)` expecting an array, which works with the actual format. But the contract documentation is wrong about the shape. Either the doc or the code needs to change. |

---

## 4. Data Model Alignment: Entities vs Actual TypeScript Types

### WalletCard

| Field (data-model.md) | shared/types.ts | main/types.ts | mcp-server WalletCard | Status |
|---|---|---|---|---|
| `id: CardID` | `id: CardID` | `id: CardID` | `id: string` | ALIGNED (mcp uses string, acceptable for standalone process) |
| `name: string` | `name: string` | `name: string` | `name: string` | ALIGNED |
| `icon: string` | `icon: string` | `icon: string` | `icon: string` | ALIGNED |
| `content: string` | `content: string` | `content: string` | `content: string` | ALIGNED |
| `summary: string` | `summary: string` | `summary: string` | `summary: string` | ALIGNED |
| `isActive: boolean` | `isActive: boolean` | `isActive: boolean` | `isActive: boolean` | ALIGNED |
| `lastInjected: string \| null` | `lastInjected: string \| null` | `lastInjected: string \| null` | `lastInjected: string \| null` | ALIGNED |
| `updatedAt: string` | `updatedAt: string` | `updatedAt: string` | `updatedAt: string` | ALIGNED |

### CardID Enum

| Value (data-model.md) | Display Name (data-model.md) | Tag (data-model.md) | shared/constants.ts Name | shared/constants.ts Tag | Status |
|---|---|---|---|---|---|
| identity | Identity | ID | Identity | ID | ALIGNED |
| voice | Voice & Tone | VT | Voice | VO | MISMATCH: Name "Voice & Tone" vs "Voice", Tag "VT" vs "VO" |
| expertise | Expertise | EX | Expertise | EX | ALIGNED |
| currentWork | Current Work | CW | Current Work | CW | ALIGNED |
| audience | Audience | AU | Audience | AU | ALIGNED |
| aesthetic | Aesthetic | AE | Aesthetic | AE | ALIGNED |
| narrative | Origin Story | NS | Narrative | NA | MISMATCH: Name "Origin Story" vs "Narrative", Tag "NS" vs "NA" |
| goals | Goals | GL | Goals | GO | MISMATCH: Tag "GL" vs "GO" |

### DetectedApp Enum

| Value (data-model.md) | Bundle ID (data-model.md) | Relevant Cards (data-model.md) | Code Bundle ID | Code APP_CARD_MAP | Status |
|---|---|---|---|---|---|
| claude | com.anthropic.claudedesktop | identity, voice, expertise, currentWork | `com.anthropic.claude` + `com.anthropic.claudefordesktop` | voice, identity, narrative | MISMATCH: Bundle ID differs; card set completely different (data model says expertise+currentWork; code says narrative) |
| chatgpt | com.openai.chat | identity, voice, expertise, currentWork | com.openai.chat | voice, identity, expertise | PARTIAL MISMATCH: Missing currentWork in code |
| cursor | com.todesktop.230313mzl4w4u92 | expertise, currentWork, aesthetic | same | currentWork, expertise | PARTIAL MISMATCH: Missing aesthetic in code |
| copilot | com.github.CopilotForXcode | expertise, currentWork | NOT IN CODE | N/A | GAP: Copilot not registered in BUNDLE_TO_APP |
| notion | notion.id | identity, currentWork, goals | notion.id | currentWork, voice, audience | MISMATCH: Entirely different card set |
| figma | com.figma.Desktop | aesthetic, currentWork, audience | com.figma.Desktop | aesthetic, currentWork | PARTIAL MISMATCH: Missing audience in code |
| slack | com.tinyspeck.slackmacgap | identity, voice, audience | NOT IN CODE | N/A | GAP: Slack not registered in BUNDLE_TO_APP |
| (not in data model) | N/A | N/A | com.linear, com.apple.mail, com.microsoft.Outlook, com.superhuman.electron, com.apple.dt.Xcode, com.microsoft.VSCode | linear, mail, outlook, superhuman, xcode, vscode | GAP: 6 apps in code but not in data model |
| unknown | (any unrecognized) | identity | N/A | identity | ALIGNED |

### InjectionEvent

| Field (data-model.md) | shared/types.ts | Status |
|---|---|---|
| `cardIds: CardID[]` | `cardIds: CardID[]` | ALIGNED |
| `app: DetectedApp` | `app: DetectedApp` | ALIGNED |
| `timestamp: string` | `timestamp: string` | ALIGNED |

### StoreSchema

| Field (data-model.md) | index.ts StoreSchema | Status |
|---|---|---|
| `cards: WalletCard[]` | `cards: WalletCard[]` | ALIGNED |
| `onboardingComplete: boolean` | `onboardingComplete: boolean` | ALIGNED |

### Validation Rules vs Code

| Rule (data-model.md) | Enforced in Code? | Status |
|---|---|---|
| Content max 2000 chars | `MAX_CONTENT_LENGTH = 500` in shared/constants.ts | MISMATCH: Data model says 2000, code enforces 500 |
| Summary max 100 chars | `MAX_SUMMARY_LENGTH = 80` in shared/constants.ts | MISMATCH: Data model says 100, code enforces 80 |
| Empty cards excluded from injection | `c.content.trim().length > 0` in index.ts ambient + inject-all-relevant | ALIGNED |
| 8 cards always exist | `createMockCards()` seeds all 8 | ALIGNED |
| `updatedAt` refreshed on save | `card.updatedAt = new Date().toISOString()` in update-card handler | ALIGNED |
| `lastInjected` updated on injection | Set in inject-card handler | ALIGNED |
| `isActive` auto-reset after 3s | `setTimeout(..., 3000)` in inject-card handler | ALIGNED |

---

## 5. Constitution Compliance

| Principle | Plan Claims | Actual Code Status | Verdict |
|---|---|---|---|
| I. Context Is Identity | PASS — "All 11 user stories serve the goal" | 8 fixed cards correctly modeled, injection channels built | PASS |
| II. Invisible Until Useful | PASS — "Menu bar tray, ambient injection, blur-to-dismiss" | `app.dock?.hide()`, blur handler hides window, ambient engine runs | PASS |
| III. Opinionated Not Configurable | PASS — "8 fixed cards, no custom card creation" | 8-card enum, no create/delete flows | PASS |
| IV. Ship Fast Ship Small | PASS — "P1 stories are independently shippable" | Stories are correctly prioritized P1/P2/P3 | PASS |
| V. Dark Dense Designed | PASS — "Dark-only, glass surfaces" | `backgroundColor: "#090A11"`, dark theme tokens in use | PASS |
| VI. Three Channels One Truth | PASS — "Ambient, manual, MCP all read from same electron-store" | Ambient + manual read store directly; MCP reads bridge file synced from store | PASS with caveat (see below) |

### Constitution Quality Standard Violations

| Standard | Violation | File |
|---|---|---|
| "no `any` types in committed code" | 3 uses of `any` in preload.ts (lines 6, 13, 17) | `src/main/preload.ts` |
| "Tailwind v4 design tokens via @theme -- no hardcoded hex values in components" | Not audited in detail, but `CardRow.tsx` hardcodes gradient hex values `#7B61FF` and `#00D9E8` (line 28) | `src/renderer/components/CardRow.tsx` |
| "Animations MUST be <200ms and interruptible" | `animate-slide-in` used in App.tsx but definition not verified; transition durations in CSS not audited | `src/renderer/App.tsx` |
| "Components MUST work at 320px width" | Not tested — Task T068 addresses this | N/A |

---

## 6. Duplicate Code Findings

### Constants Duplicated Between main/ and shared/

`CARD_META`, `BUNDLE_TO_APP`, and `APP_CARD_MAP` are defined identically in both:
- `/Users/ryanrosenthal/dev/wallet/src/main/constants.ts`
- `/Users/ryanrosenthal/dev/wallet/src/shared/constants.ts`

Differences between the two copies:
- **shared/constants.ts has `prompt` and `surfacesWhen` fields** in CARD_META that main/constants.ts does NOT have
- Both have identical BUNDLE_TO_APP and APP_CARD_MAP values

This is documented as intentional in `research.md` (Decision 2): "Shared types are duplicated due to CJS main process vs ESM renderer bundling." However, having two sources of truth for CARD_META with different shapes is fragile.

### Types Duplicated Between main/ and shared/

- `src/main/types.ts` and `src/shared/types.ts` define the same `CardID`, `WalletCard`, and `DetectedApp` types
- `src/shared/types.ts` additionally defines `WalletState`, `InjectionEvent`, and `ALL_CARD_IDS`
- `mcp-server/index.ts` redefines `WalletCard` inline (lines 20-29)

Three copies of the same core types. A drift vector if any field is added.

---

## 7. Missing Code Components

| Component | Referenced In | File Expected At | Status |
|---|---|---|---|
| `Onboarding.tsx` | plan.md project structure, Tasks T011-T017, spec US1 | `src/renderer/components/Onboarding.tsx` | DOES NOT EXIST |
| `Settings.tsx` | plan.md project structure, Tasks T063-T067, spec US11 | `src/renderer/components/Settings.tsx` | DOES NOT EXIST |
| Onboarding gate in App.tsx | Task T015 | `src/renderer/App.tsx` | NOT IMPLEMENTED — App.tsx goes straight to CardTray, never checks `getOnboardingComplete()` |
| View routing system | Task T006 | `src/renderer/App.tsx` | PARTIAL — Uses conditional rendering (if/else chain), not a proper view router. Works but doesn't support 5 named views. |

---

## 8. Behavioral Gaps (Code vs Spec Acceptance Criteria)

| ID | Spec Says | Code Does | Impact |
|---|---|---|---|
| BG-1 | US3 AC2: Detail metadata shows "Last injected: [timestamp or 'Never']" | CardDetail.tsx only shows `lastInjected` section when `card.lastInjected` is truthy (line 78: `{card.lastInjected && ...}`). If never injected, nothing is shown. | Does not show "Never" — shows nothing. Violates AC. |
| BG-2 | US4 AC7: "Given the user has unsaved changes, When they navigate back without saving, Then they see a confirmation prompt" | CardEditor.tsx `onClose` directly navigates back. No dirty-check or confirmation dialog. | Missing feature. Task T033 covers this but not yet implemented. |
| BG-3 | US5 AC5: "Given a card has empty content, When the user tries to inject it, Then the inject button is disabled" | CardDetail.tsx inject button is always enabled. No empty-content check. | Missing guard. Task T038 covers this but not yet implemented. |
| BG-4 | US5 AC3: "Injected card shows pulsing active indicator for 3 seconds" after manual inject | `inject-card` handler updates `isActive` in store and resets after 3s, but does NOT send `cards-updated` event immediately — only sends it after the 3s reset. Renderer calls `setCards(updated)` from the return value, but this happens before the isActive timeout fires. The flow works but the visual pulse depends on the renderer correctly processing the returned updated array, which it does. | WORKING — but fragile. |
| BG-5 | US2 AC5: "Green dot and CONTEXT ACTIVE label confirm the engine is running" | Footer always shows "CONTEXT ACTIVE" regardless of whether the engine is actually running. No dynamic state. | Hardcoded — never shows "CONTEXT PAUSED". |
| BG-6 | US8 AC1: "User triggers inject all relevant" | IPC handler exists. Preload bridge exists. No UI trigger (button) exists in CardTray.tsx. | Backend done, frontend missing. |
| BG-7 | Spec FR-004: "osascript polling every 2 seconds" | `context.ts` polls every 2 seconds. BUT it calls `onAppChange` for EVERY app switch including unknown apps, which triggers clipboard injection for unknown apps with just the identity card. | Possible unintended clipboard writes when switching between non-AI apps. |
| BG-8 | US6 AC2: "When user switches between two non-AI apps, Then no clipboard injection occurs" | Code injects for `unknown` app using `["identity"]` card set. Any unrecognized app triggers an injection. | VIOLATION of acceptance criteria. |

---

## 9. Summary of All Gaps

### Critical (blocks spec compliance)

1. **BG-8 / Context engine injects on unknown apps** — Violates US6 AC2. Should skip injection for `unknown` detected apps.
2. **MCP-5 / `get_all_cards` output format** — Contract promises formatted text with full content; code returns JSON summaries. Any consumer following the contract will get unexpected output.
3. **IPC-5 / `inject-all-relevant` missing side effects** — Does not update `isActive`, `lastInjected`, or emit events. Silently breaks visual feedback.

### High (spec/code drift that causes confusion)

4. **MCP-1 / Parameter name mismatch** — Contract says `task_description`, code says `task`. Will break any consumer following the contract.
5. **MCP-6 / Bridge file format** — Contract documents a wrapper object; code writes a bare array. Documentation is misleading.
6. **Data model vs code: MAX_CONTENT_LENGTH** — Data model says 2000 characters; code enforces 500. 4x difference.
7. **Data model vs code: DetectedApp card mappings** — 5 out of 7 documented apps have different card sets in code vs data model. The data model cannot be trusted as a reference.
8. **Missing components: Onboarding.tsx, Settings.tsx** — Planned in spec, referenced in tasks, files do not exist.

### Medium (inconsistencies that should be resolved)

9. **CardID naming mismatches** — "Voice & Tone" vs "Voice", "Origin Story" vs "Narrative", tags VT/NS/GL vs VO/NA/GO.
10. **MCP-4 / Identity card not always included** — Contract promises baseline identity; code does not guarantee it.
11. **IPC-4 / `any` types in preload.ts** — Violates constitution quality standard.
12. **Data model vs code: Copilot and Slack** — Documented in data model as supported apps; not registered in code.
13. **Data model vs code: 6 undocumented apps** — linear, mail, outlook, superhuman, xcode, vscode exist in code but not in data model.

### Low (cleanup items)

14. **MCP-2 / Dead `app_context` parameter** — Declared in schema, never used.
15. **BG-1 / "Never" label not shown** — Minor UI omission, easy fix.
16. **BG-5 / Hardcoded footer status** — Always says "CONTEXT ACTIVE", never reflects engine state.
17. **Three copies of WalletCard type** — Drift risk across main/, shared/, and mcp-server/.
18. **Hardcoded hex in CardRow.tsx** — Constitution says use @theme tokens.

---

## 10. Recommendations

### Immediate (before next implementation session)

1. **Fix context engine to skip `unknown` apps** — Add `if (app === "unknown") return;` in the context engine callback in `index.ts`. This is a one-line fix that resolves a critical spec violation (BG-8).

2. **Align MCP contract** — Update `contracts/mcp-tools.md` to match actual code:
   - Parameter name: `task` not `task_description`
   - Document `app_context` parameter or remove it from code
   - Fix `get_all_cards` output description to match JSON summary format
   - Fix bridge file format documentation to match bare array

3. **Align data-model.md** — Update the DetectedApp table and CardID table to match actual code values. The data model should be the source of truth, and right now it contradicts the code in multiple places.

4. **Fix MAX_CONTENT_LENGTH** — Decide whether 500 or 2000 is correct, then update whichever is wrong (data-model.md or shared/constants.ts).

### Before MVP ship (P1 stories)

5. **Create Onboarding.tsx** — Implement Tasks T011-T017. The onboarding gate in App.tsx (T015) is also missing.

6. **Wire `inject-all-relevant` side effects** — The handler needs to update `isActive`, `lastInjected`, send `injection` event, and schedule 3s reset, matching the `inject-card` handler's behavior.

7. **Remove `any` types from preload.ts** — Import proper types or use the type definitions that already exist in `types.d.ts`.

8. **Add empty-content guard to inject button** — CardDetail.tsx should disable the inject button when `card.content.trim().length === 0`.

### Before full v1 beta ship

9. **Create Settings.tsx** — Implement Tasks T063-T067. Wire `stopContextEngine` / `startContextEngine` as IPC handlers. Make footer status dynamic.

10. **Add `get-active-app` IPC handler** — Needed for "inject all relevant" to know which app to target.

11. **Resolve CARD_META duplication** — Consider making `main/constants.ts` import a subset from shared, or at minimum keep them manually synchronized. The current state where shared/ has `prompt` and `surfacesWhen` but main/ does not is a maintenance risk.

12. **Add MCP `get_all_cards` content** — Either update the contract to document the JSON summary format, or update the code to return the formatted text block with full content as originally specified. The full-content format is more useful for AI consumers.

13. **Guarantee identity card in `get_context_for_task`** — Add `if (!relevantIds.includes("identity")) relevantIds.push("identity");` to match the contract promise.
