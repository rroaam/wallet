# Feature Specification: Wallet v1 Beta — Complete UX Flows

**Feature Branch**: `001-wallet-v1-ux`
**Created**: 2026-03-09
**Status**: Draft
**Input**: User description: "Complete UX flows for Wallet v1 beta — every interaction path from first launch to daily use, covering all three injection channels and the agentic identity positioning."

## User Scenarios & Testing *(mandatory)*

### User Story 1 — First Launch & Onboarding (Priority: P1)

A new user installs Wallet and launches it for the first time. The tray icon appears in the menu bar. They click it and see an onboarding flow that explains what Wallet does — "your AI tools will just know you" — and walks them through filling out their first card (Identity). After completing one card, they land in the card tray and can fill the rest at their own pace.

**Why this priority**: Without onboarding, no user understands what 8 empty cards mean. The first 60 seconds determine whether someone keeps the app or deletes it. This is the top of the funnel.

**Independent Test**: Install the app fresh (clear electron-store data). Click tray icon. Complete onboarding. Verify Identity card is saved and visible in the tray.

**Acceptance Scenarios**:

1. **Given** a fresh install with no stored data, **When** user clicks the tray icon, **Then** the onboarding screen appears (not the card tray)
2. **Given** the onboarding screen is showing, **When** user reads the value prop and taps "Get Started," **Then** the Identity card editor appears with a prompt hint
3. **Given** the Identity card editor is showing, **When** user types content and taps "Save," **Then** the card is persisted and the user lands on the card tray with the Identity card populated
4. **Given** onboarding is complete, **When** user clicks the tray icon on subsequent launches, **Then** the card tray shows directly (onboarding does not repeat)
5. **Given** the user is mid-onboarding, **When** they click outside the popup, **Then** progress is preserved and they resume where they left off on next open

---

### User Story 2 — Browsing the Card Tray (Priority: P1)

A returning user clicks the tray icon and sees all 8 cards in a scrollable list. Each row shows the card icon, name, a one-line summary of their content, and a subtle tag. Cards that were recently injected show a pulsing cyan indicator. The footer shows the context engine status (active app being watched).

**Why this priority**: The tray is the home screen. If it doesn't communicate "here's your context, it's alive, it's working" at a glance, the product feels dead.

**Independent Test**: Open the tray with mock data for all 8 cards. Verify all cards render with icons, names, summaries. Verify scroll works. Verify the active indicator pulses on recently-injected cards.

**Acceptance Scenarios**:

1. **Given** all 8 cards have content, **When** user opens the tray, **Then** all 8 cards are visible in a scrollable list with icon, name, summary, and tag
2. **Given** a card was injected within the last 3 seconds, **When** user views the tray, **Then** that card's row shows a pulsing cyan dot indicator
3. **Given** no cards were recently injected, **When** user views the tray, **Then** no active indicators are visible
4. **Given** the tray is open, **When** user scrolls, **Then** the list scrolls smoothly with no jank or overflow
5. **Given** the tray is open, **When** user views the footer, **Then** a green dot and "CONTEXT ACTIVE" label confirm the engine is running

---

### User Story 3 — Viewing Card Detail (Priority: P1)

A user taps a card row in the tray and transitions to a detail view. The detail shows the full card content (not truncated), metadata (last injected timestamp, which AI apps surface this card), and a prominent "Inject" button with a gradient border.

**Why this priority**: Users need to verify and trust what's being sent to their AI tools. The detail view is where trust is built — "this is exactly what Claude/ChatGPT sees about me."

**Independent Test**: Click any populated card row. Verify the detail view renders with full content, metadata, and inject button. Verify back navigation returns to tray.

**Acceptance Scenarios**:

1. **Given** the tray is showing, **When** user taps a card row, **Then** the detail view slides in showing the card icon, name, and full content
2. **Given** the detail view is showing, **When** user reads the metadata section, **Then** they see "Last injected: [timestamp or 'Never']" and "Surfaces when: [app list]"
3. **Given** the detail view is showing, **When** user taps the back arrow, **Then** they return to the card tray with scroll position preserved
4. **Given** the detail view is showing, **When** user taps the "Inject" button, **Then** the card content is copied to clipboard in the formatted [WALLET CONTEXT] block
5. **Given** a card has never been injected, **When** viewing its detail, **Then** "Last injected" shows "Never" rather than a blank or null value

---

### User Story 4 — Editing a Card (Priority: P1)

A user taps the edit icon on the detail view and enters the card editor. The editor shows a textarea pre-filled with current content, a prompt hint specific to the card type (e.g., "Describe your design aesthetic and visual references"), a character counter, and a save button. Optionally, an "AI Suggest" chip offers to generate a draft.

**Why this priority**: The entire product value depends on users actually writing good card content. The editor is where content quality is determined. Bad editor = bad cards = useless injection.

**Independent Test**: Navigate to any card detail, tap edit, modify content, save. Verify the updated content persists and appears in the tray summary.

**Acceptance Scenarios**:

1. **Given** the detail view is showing, **When** user taps the edit icon, **Then** the editor appears with textarea pre-filled with current card content
2. **Given** the editor is showing, **When** user views the textarea, **Then** a prompt hint relevant to the card type is visible as placeholder text
3. **Given** the editor is showing, **When** user types, **Then** the character counter updates in real time showing current/max length
4. **Given** the user has modified content, **When** they tap "Save," **Then** the card is persisted, updatedAt timestamp refreshes, and the detail view shows the new content
5. **Given** the user has modified content, **When** they tap "Save," **Then** the tray summary regenerates to reflect the new content
6. **Given** the editor is showing, **When** user taps "AI Suggest," **Then** a generated draft fills the textarea (user can accept, edit, or discard)
7. **Given** the user has unsaved changes, **When** they navigate back without saving, **Then** they see a confirmation prompt ("Discard changes?")

---

### User Story 5 — Manual Card Injection (Priority: P1)

A user is chatting with Claude or ChatGPT and realizes their AI tool doesn't know their voice style. They click the Wallet tray icon, find the Voice card, tap "Inject," and paste the clipboard content into their AI chat. The AI immediately responds in their voice.

**Why this priority**: This is the core value proposition demonstrated end-to-end. If manual inject doesn't work flawlessly, nothing else matters.

**Independent Test**: Open tray, inject a card, switch to a text editor, paste. Verify the pasted content matches the formatted [WALLET CONTEXT] block with the correct card data.

**Acceptance Scenarios**:

1. **Given** the user is on a card detail view, **When** they tap "Inject," **Then** the card content is formatted as a [WALLET CONTEXT] block and copied to the system clipboard
2. **Given** the inject was successful, **When** the user pastes in any app, **Then** the pasted text is the formatted context block with card name and content
3. **Given** the inject was successful, **When** the user views the tray, **Then** the injected card shows a pulsing active indicator for 3 seconds
4. **Given** the inject was successful, **When** the user checks the card detail, **Then** "Last injected" shows the current timestamp
5. **Given** a card has empty content, **When** the user tries to inject it, **Then** the inject button is disabled or shows a hint to add content first

---

### User Story 6 — Ambient Auto-Injection on App Switch (Priority: P2)

A user is working normally — they switch from VS Code to Claude Desktop. Wallet detects the app change and automatically copies the relevant cards (Expertise, Current Work, Voice) to the clipboard. A subtle notification appears. The user pastes into Claude and their context is already there.

**Why this priority**: This is the "magic moment" — zero-effort context delivery. It's what makes Wallet more than a clipboard manager. But it depends on manual injection working first (P1).

**Independent Test**: With the context engine running, switch from a non-AI app to an AI app (e.g., Claude). Verify the clipboard contains the formatted context block with the correct cards for that app.

**Acceptance Scenarios**:

1. **Given** the context engine is running, **When** user switches to Claude Desktop, **Then** the relevant cards (per APP_CARD_MAP) are formatted and copied to clipboard
2. **Given** the context engine is running, **When** user switches between two non-AI apps, **Then** no clipboard injection occurs
3. **Given** the context engine is running, **When** user switches to ChatGPT, **Then** different relevant cards are selected than for Claude (per mapping)
4. **Given** an injection occurred, **When** user views the tray within 3 seconds, **Then** the injected cards show pulsing active indicators
5. **Given** a relevant card has empty content, **When** an ambient injection is triggered, **Then** that empty card is excluded from the clipboard (only populated cards are injected)
6. **Given** the renderer is open, **When** an ambient injection occurs, **Then** the renderer receives an injection event with card IDs, app name, and timestamp

---

### User Story 7 — MCP Server Integration (Priority: P2)

A developer using Claude Desktop has the Wallet MCP server registered. When they ask Claude "write a landing page for my product," Claude calls the `get_context_for_task` tool, receives the relevant cards (Identity, Aesthetic, Current Work, Audience), and writes copy that sounds like the user without them pasting anything.

**Why this priority**: MCP is the future-proof channel — native AI tool integration without clipboard hacks. But it requires the MCP server to be built and registered, which is a separate setup step.

**Independent Test**: Start the MCP server. Call `get_all_cards` and verify it returns all 8 cards. Call `get_context_for_task` with "write marketing copy" and verify it returns relevant cards.

**Acceptance Scenarios**:

1. **Given** the MCP server is running and registered in Claude Desktop, **When** Claude needs user context, **Then** it can call `get_card` with a card ID and receive that card's content
2. **Given** the MCP server is running, **When** Claude calls `get_all_cards`, **Then** it receives all 8 cards with their current content, summaries, and metadata
3. **Given** the MCP server is running, **When** Claude calls `get_context_for_task` with a task description, **Then** it receives the most relevant cards based on keyword matching
4. **Given** a card was just updated in the Wallet UI, **When** the MCP server is queried, **Then** it returns the updated content (not stale data)
5. **Given** the MCP bridge file doesn't exist yet, **When** the Wallet app starts, **Then** it creates the bridge file with current card data

---

### User Story 8 — Inject All Relevant Cards (Priority: P2)

A user is about to start a new conversation with an AI tool. Instead of injecting cards one by one, they want to inject all cards relevant to the current app. They use the "inject all" action (from the tray footer or a keyboard shortcut) and all relevant cards are formatted and copied as a single block.

**Why this priority**: Power users want batch injection. One paste, full context. This reduces friction from "inject 3 cards = 3 clicks" to "inject all = 1 click."

**Independent Test**: Trigger "inject all relevant" for a specific app. Verify clipboard contains a single [WALLET CONTEXT] block with all relevant cards concatenated.

**Acceptance Scenarios**:

1. **Given** the tray is open, **When** user triggers "inject all relevant," **Then** all cards mapped to the current active app are formatted into a single clipboard block
2. **Given** multiple cards are relevant, **When** the injection occurs, **Then** the clipboard block contains each card separated clearly with card names as headers
3. **Given** one of the relevant cards has empty content, **When** the injection occurs, **Then** the empty card is excluded from the block
4. **Given** no relevant cards have content, **When** the injection is triggered, **Then** nothing is copied and the user sees a hint to fill out their cards

---

### User Story 9 — Tray State & Visual Feedback (Priority: P2)

The tray popup communicates its current state visually. When a card is being injected, the card row pulses cyan for 3 seconds. The footer shows whether the context engine is active. When the tray opens, it animates in. When it closes (click outside), it dismisses cleanly.

**Why this priority**: Without visual feedback, users don't trust that injections happened. The app feels broken if nothing moves.

**Independent Test**: Trigger an injection and observe the tray. Verify the active indicator appears, pulses for 3 seconds, and fades. Verify tray open/close animations are smooth.

**Acceptance Scenarios**:

1. **Given** a card was just injected, **When** the tray is visible, **Then** that card's row shows a pulsing cyan dot for exactly 3 seconds
2. **Given** 3 seconds have passed since injection, **When** the active state resets, **Then** the dot disappears and the card row returns to its default state
3. **Given** the tray is closed, **When** user clicks the tray icon, **Then** the popup appears anchored below the tray icon at the correct position
4. **Given** the tray is open, **When** user clicks outside the popup, **Then** the popup hides and the tray state event fires ("idle")
5. **Given** the tray is open, **When** user clicks the tray icon again, **Then** the popup toggles closed

---

### User Story 10 — Agentic Identity Use Case (Priority: P3)

A user deploys an AI agent (e.g., a content creator bot, a developer advocate agent like the RevenueCat posting) and needs the agent to maintain a consistent identity across platforms. They fill out all 8 Wallet cards with the agent's persona — voice, expertise, audience, goals. The MCP server feeds this identity to the agent on every interaction, ensuring the agent never sounds generic.

**Why this priority**: This is the expansion narrative — Wallet as identity infrastructure for AI agents, not just humans. It's P3 because it works with existing features (MCP + cards) but needs positioning and documentation, not new code.

**Independent Test**: Fill all 8 cards with an AI agent's persona. Query the MCP server. Verify the returned context would give an AI agent a consistent, specific identity.

**Acceptance Scenarios**:

1. **Given** all 8 cards are filled with an agent persona, **When** the MCP server returns context for a task, **Then** the combined context is sufficient for an AI to maintain a distinct personality
2. **Given** the Voice card says "never use emojis, always lowercase," **When** the context is injected into an AI conversation, **Then** the AI's responses follow that voice constraint
3. **Given** the Goals card describes "publish 2 posts per week about RevenueCat," **When** an agent queries context for content creation, **Then** the Goals card is included in the relevant set

---

### User Story 11 — Settings & Preferences (Priority: P3)

A user wants to configure basic preferences: toggle the context engine on/off, see which apps are being monitored, and quit the app. They access settings from the tray footer gear icon.

**Why this priority**: Settings are table stakes for a menu bar app but don't drive core value. Ship with minimal settings — context engine toggle and quit.

**Independent Test**: Open tray, tap gear icon. Verify settings panel shows context engine toggle. Toggle off, verify engine stops. Toggle on, verify engine resumes.

**Acceptance Scenarios**:

1. **Given** the tray is showing, **When** user taps the gear icon in the footer, **Then** a settings panel appears
2. **Given** the settings panel is showing, **When** user toggles the context engine off, **Then** ambient injections stop and the footer status changes to "CONTEXT PAUSED"
3. **Given** the settings panel is showing, **When** user taps "Quit Wallet," **Then** the app closes completely (tray icon removed, process exits)

---

### Edge Cases

- What happens when the user's clipboard already has important content and ambient injection overwrites it?
- How does the app behave when osascript fails or returns an unrecognized app bundle ID?
- What happens when electron-store data gets corrupted or the schema changes between versions?
- What happens when the tray icon position is at the far edge of the screen and the popup would overflow?
- How does the app handle extremely long card content (>5000 characters)?
- What happens when two AI apps are open simultaneously and the user rapid-switches between them?
- What happens when the MCP bridge file is deleted while the MCP server is running?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a tray icon in the macOS menu bar that toggles a 320×520px popup window
- **FR-002**: System MUST persist all 8 card contents locally and survive app restarts
- **FR-003**: System MUST format card content as `[WALLET CONTEXT]...[/WALLET CONTEXT]` blocks for clipboard injection
- **FR-004**: System MUST detect the active foreground app via osascript polling every 2 seconds
- **FR-005**: System MUST map detected apps to relevant card sets and auto-inject on AI app switch
- **FR-006**: Users MUST be able to view, edit, and save each of the 8 cards independently
- **FR-007**: System MUST show a pulsing visual indicator on cards that were injected within the last 3 seconds
- **FR-008**: System MUST write card data to a bridge file for the MCP server to consume
- **FR-009**: System MUST show an onboarding flow on first launch that does not repeat after completion
- **FR-010**: System MUST provide an "inject all relevant" action that batches multiple cards into one clipboard block
- **FR-011**: Users MUST be able to manually inject any single card from its detail view
- **FR-012**: System MUST exclude cards with empty content from any injection (ambient, manual, or batch)
- **FR-013**: The MCP server MUST expose `get_card`, `get_all_cards`, and `get_context_for_task` tools
- **FR-014**: System MUST anchor the popup window directly below the tray icon and dismiss on blur
- **FR-015**: Each card editor MUST show a prompt hint specific to the card type

### Key Entities

- **WalletCard**: The core data unit. Has id (one of 8 fixed types), name, icon, content (user-written text), summary (one-line preview), isActive (recently injected), lastInjected (timestamp), updatedAt (timestamp)
- **CardID**: Fixed enum of 8 values: identity, voice, expertise, currentWork, audience, aesthetic, narrative, goals
- **DetectedApp**: The active foreground application, mapped from macOS bundle identifiers to known AI tools (Claude, ChatGPT, Cursor, Copilot, etc.)
- **InjectionEvent**: A record of an injection occurrence — which cards were injected, to which app, at what time

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new user can complete onboarding and fill their first card in under 90 seconds
- **SC-002**: A user can manually inject a card and paste it into an AI tool in under 5 seconds (2 clicks + paste)
- **SC-003**: Ambient injection fires within 2 seconds of switching to a recognized AI app
- **SC-004**: 100% of card edits persist across app restarts with no data loss
- **SC-005**: The MCP server returns accurate, current card data with no stale reads after a card update
- **SC-006**: The tray popup renders all 8 cards without scroll jank at 60fps on a 2020+ Mac
- **SC-007**: 90% of beta users (target: 50) fill out at least 3 of 8 cards within their first week
- **SC-008**: The app uses less than 100MB of memory during normal operation
- **SC-009**: Zero crashes during normal usage over a 1-hour session (tray open/close, inject, edit, app switch cycles)
