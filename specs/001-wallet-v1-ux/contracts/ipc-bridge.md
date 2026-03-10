# IPC Bridge Contract: Renderer ↔ Main Process

All communication between the React renderer and Electron main process passes through the `window.wallet` contextBridge API defined in `preload.ts`.

## Invoke Channels (Renderer → Main → Response)

### `get-cards`

Returns all 8 cards from the store.

- **Input**: none
- **Output**: `WalletCard[]` (always 8 items)
- **Called by**: `useCards` hook on mount and after updates

### `update-card`

Saves modified card content to the store.

- **Input**: `WalletCard` (the full card object with updated content/summary)
- **Output**: `WalletCard[]` (full updated card array)
- **Side effects**: Updates `updatedAt` timestamp, syncs MCP bridge file
- **Called by**: CardEditor save action

### `inject-card`

Injects a single card to the clipboard.

- **Input**: `CardID` (string)
- **Output**: `WalletCard[]` (updated with isActive/lastInjected)
- **Side effects**: Writes formatted block to clipboard, sets isActive=true for 3s, updates lastInjected, syncs MCP bridge
- **Called by**: CardDetail inject button

### `inject-all-relevant`

Injects all cards relevant to a specific app.

- **Input**: `string` (app name)
- **Output**: `WalletCard[]`
- **Side effects**: Writes formatted multi-card block to clipboard
- **Called by**: Tray footer "inject all" action

### `get-onboarding-complete`

Checks if onboarding has been completed.

- **Input**: none
- **Output**: `boolean`
- **Called by**: App.tsx on mount to decide initial view

### `set-onboarding-complete`

Marks onboarding as done.

- **Input**: none
- **Output**: `true`
- **Side effects**: Sets `onboardingComplete = true` in store
- **Called by**: Onboarding component on completion

## Event Channels (Main → Renderer)

### `cards-updated`

Sent when card state changes (e.g., after isActive reset timeout).

- **Payload**: `WalletCard[]`
- **Listener**: `useCards` hook

### `injection`

Sent when an ambient injection occurs.

- **Payload**: `InjectionEvent` (`{ cardIds: CardID[], app: DetectedApp, timestamp: string }`)
- **Listener**: App.tsx (for visual feedback)

### `tray-state`

Sent when the tray popup opens or closes.

- **Payload**: `"trayOpen" | "idle"`
- **Listener**: App.tsx (for animations/state management)
