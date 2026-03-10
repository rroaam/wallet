# MCP Server Tool Contract

The Wallet MCP server exposes 3 tools via the Model Context Protocol. It reads card data from `~/Library/Application Support/Wallet/cards.json`, written by the main Electron process.

## Tool: `get_card`

Returns a single card by ID.

**Input Schema**:
```json
{
  "type": "object",
  "properties": {
    "card_id": {
      "type": "string",
      "enum": ["identity", "voice", "expertise", "currentWork", "audience", "aesthetic", "narrative", "goals"],
      "description": "The ID of the card to retrieve"
    }
  },
  "required": ["card_id"]
}
```

**Output**: Text content of the specified card, or error message if card not found.

## Tool: `get_all_cards`

Returns all 8 cards with their content and metadata.

**Input Schema**:
```json
{
  "type": "object",
  "properties": {}
}
```

**Output**: Formatted text block with all 8 cards, each with name header and content. Empty cards are included but marked as "(not yet filled)".

## Tool: `get_context_for_task`

Returns the most relevant cards for a given task description. Uses keyword matching to select cards.

**Input Schema**:
```json
{
  "type": "object",
  "properties": {
    "task_description": {
      "type": "string",
      "description": "Description of what the user is trying to accomplish"
    }
  },
  "required": ["task_description"]
}
```

**Output**: Formatted text block with relevant cards selected by keyword analysis of the task description. Always includes the Identity card as baseline context.

**Keyword Mapping**:
- "write", "copy", "email", "message" → voice
- "code", "build", "develop", "debug" → expertise, currentWork
- "design", "ui", "layout", "visual" → aesthetic, expertise
- "market", "audience", "user", "customer" → audience
- "brand", "story", "about" → narrative, identity
- "plan", "goal", "roadmap", "ship" → goals, currentWork

## Bridge File Format

**Path**: `~/Library/Application Support/Wallet/cards.json`

```json
{
  "cards": [
    {
      "id": "identity",
      "name": "Identity",
      "content": "...",
      "summary": "...",
      "lastInjected": "2026-03-09T12:00:00.000Z",
      "updatedAt": "2026-03-09T12:00:00.000Z"
    }
  ],
  "updatedAt": "2026-03-09T12:00:00.000Z"
}
```

The bridge file is overwritten atomically on every card update and on app launch.
