import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { readFileSync } from "fs";
import { join } from "path";
import { homedir } from "os";

// Shared cards file path — written by the Wallet macOS app
const CARDS_PATH = join(
  homedir(),
  "Library",
  "Application Support",
  "Wallet",
  "cards.json"
);

interface WalletCard {
  id: string;
  name: string;
  icon: string;
  content: string;
  summary: string;
  isActive: boolean;
  lastInjected: string | null;
  updatedAt: string;
}

function loadCards(): WalletCard[] {
  try {
    const raw = readFileSync(CARDS_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function formatCards(cards: WalletCard[]): string {
  if (cards.length === 0) return "No wallet cards found.";

  const lines = [
    "[WALLET CONTEXT]",
    "The following is personal context about the user.",
    "Use it to calibrate your responses appropriately.",
    "",
  ];

  for (const card of cards) {
    const label = card.id.toUpperCase().replace("CURRENTWORK", "CURRENT WORK");
    lines.push(`${label}: ${card.content}`);
  }

  lines.push("");
  lines.push("[/WALLET CONTEXT]");

  return lines.join("\n");
}

function getRelevantCards(
  cards: WalletCard[],
  task: string
): WalletCard[] {
  const t = task.toLowerCase();

  let relevantIds: string[];

  if (/write|email|post|copy|caption/.test(t)) {
    relevantIds = ["voice", "identity", "audience"];
  } else if (/design|figma|visual|ui|ux|aesthetic/.test(t)) {
    relevantIds = ["aesthetic", "currentWork"];
  } else if (/pitch|investor|raise|funding|narrative/.test(t)) {
    relevantIds = ["narrative", "identity", "goals"];
  } else if (/plan|strategy|goal|quarter|priority/.test(t)) {
    relevantIds = ["goals", "currentWork"];
  } else if (/expert|knowledge|opinion|thought/.test(t)) {
    relevantIds = ["expertise", "identity"];
  } else {
    relevantIds = ["identity", "currentWork", "voice"];
  }

  return cards.filter(
    (c) => relevantIds.includes(c.id) && c.content.trim().length > 0
  );
}

// Create MCP server
const server = new Server(
  { name: "wallet", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// List tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "get_card",
      description:
        "Get a specific Wallet context card by ID. Cards contain personal context about the user.",
      inputSchema: {
        type: "object" as const,
        properties: {
          card_id: {
            type: "string",
            enum: [
              "identity",
              "voice",
              "expertise",
              "currentWork",
              "audience",
              "aesthetic",
              "narrative",
              "goals",
            ],
            description: "The card ID to retrieve",
          },
        },
        required: ["card_id"],
      },
    },
    {
      name: "get_all_cards",
      description:
        "Get all 8 Wallet context cards with name and summary.",
      inputSchema: {
        type: "object" as const,
        properties: {},
      },
    },
    {
      name: "get_context_for_task",
      description:
        "Get relevant personal context cards based on a task description. Returns 2-3 cards most relevant to the task, formatted as a context block.",
      inputSchema: {
        type: "object" as const,
        properties: {
          task: {
            type: "string",
            description:
              "Description of what you're helping the user with",
          },
          app_context: {
            type: "string",
            description:
              "Optional: the app or tool the user is working in",
          },
        },
        required: ["task"],
      },
    },
  ],
}));

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const cards = loadCards();
  const { name } = request.params;
  const args = request.params.arguments as Record<string, string>;

  switch (name) {
    case "get_card": {
      const card = cards.find((c) => c.id === args.card_id);
      if (!card) {
        return {
          content: [
            { type: "text" as const, text: `Card '${args.card_id}' not found.` },
          ],
        };
      }
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                name: card.name,
                content: card.content,
                summary: card.summary,
                lastInjected: card.lastInjected,
              },
              null,
              2
            ),
          },
        ],
      };
    }

    case "get_all_cards": {
      const summaries = cards.map((c) => ({
        id: c.id,
        name: c.name,
        summary: c.summary,
      }));
      return {
        content: [
          { type: "text" as const, text: JSON.stringify(summaries, null, 2) },
        ],
      };
    }

    case "get_context_for_task": {
      const relevant = getRelevantCards(cards, args.task || "");
      return {
        content: [
          { type: "text" as const, text: formatCards(relevant) },
        ],
      };
    }

    default:
      return {
        content: [
          { type: "text" as const, text: `Unknown tool: ${name}` },
        ],
      };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
