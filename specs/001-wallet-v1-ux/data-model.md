# Data Model: Wallet v1 Beta

## Entities

### WalletCard

The core data unit. Represents one of 8 fixed personal context categories.

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | CardID | Fixed identifier | One of 8 enum values, immutable |
| name | string | Display name | Derived from CARD_META, immutable |
| icon | string | Icon identifier | Derived from CARD_META, immutable |
| content | string | User-written context text | Max 2000 characters, editable |
| summary | string | One-line preview | Max 100 characters, editable |
| isActive | boolean | Recently injected indicator | Auto-set true on inject, reset to false after 3s |
| lastInjected | string \| null | ISO timestamp of last injection | Null if never injected |
| updatedAt | string | ISO timestamp of last edit | Auto-updated on save |

**State transitions**:
- `isActive`: false → true (on injection) → false (after 3s timeout)
- `lastInjected`: null → ISO timestamp (on first injection, then updated on each subsequent injection)

### CardID (Enum)

Fixed set of 8 card types. Not user-extensible.

| Value | Display Name | Icon | Tag |
|-------|-------------|------|-----|
| identity | Identity | user | ID |
| voice | Voice & Tone | audio-waveform | VT |
| expertise | Expertise | brain | EX |
| currentWork | Current Work | hammer | CW |
| audience | Audience | users | AU |
| aesthetic | Aesthetic | palette | AE |
| narrative | Origin Story | book-open | NS |
| goals | Goals | flag | GL |

### DetectedApp

Represents a recognized foreground application mapped from macOS bundle identifiers.

| Value | Bundle ID Pattern | Relevant Cards |
|-------|-------------------|----------------|
| claude | com.anthropic.claudedesktop | identity, voice, expertise, currentWork |
| chatgpt | com.openai.chat | identity, voice, expertise, currentWork |
| cursor | com.todesktop.230313mzl4w4u92 | expertise, currentWork, aesthetic |
| copilot | com.github.CopilotForXcode | expertise, currentWork |
| notion | notion.id | identity, currentWork, goals |
| figma | com.figma.Desktop | aesthetic, currentWork, audience |
| slack | com.tinyspeck.slackmacgap | identity, voice, audience |
| unknown | (any unrecognized) | identity |

### InjectionEvent

Emitted when cards are injected (ambient or manual). Sent from main process to renderer via IPC.

| Field | Type | Description |
|-------|------|-------------|
| cardIds | CardID[] | Which cards were injected |
| app | DetectedApp | Which app triggered/received the injection |
| timestamp | string | ISO timestamp of the event |

### StoreSchema

Top-level persistence schema for electron-store.

| Field | Type | Default |
|-------|------|---------|
| cards | WalletCard[] | 8 cards with mock content |
| onboardingComplete | boolean | false |

## Relationships

```
StoreSchema
├── cards: WalletCard[8]        (always exactly 8, ordered by CARD_META)
│   └── id → CardID             (fixed enum, determines metadata from CARD_META)
│   └── id → APP_CARD_MAP       (determines which apps surface this card)
└── onboardingComplete: boolean  (gates onboarding vs tray view)

ContextEngine
└── detectedApp → BUNDLE_TO_APP → APP_CARD_MAP → CardID[]
    └── filters cards by relevance for ambient injection

MCPBridge
└── reads StoreSchema.cards → writes cards.json to disk
    └── MCP server reads cards.json on each tool call
```

## Validation Rules

- Card content MUST NOT exceed 2000 characters
- Card summary MUST NOT exceed 100 characters
- Cards with empty content (trimmed length 0) MUST be excluded from all injections
- All 8 cards MUST always exist in the store — cards are never created or deleted, only edited
- `updatedAt` MUST be refreshed on every content save
- `lastInjected` MUST be updated on every injection (ambient or manual)
- `isActive` MUST auto-reset to false after 3 seconds
