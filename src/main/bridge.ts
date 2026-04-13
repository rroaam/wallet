// Local HTTP bridge for the Wallet browser extension.
//
// Binds to 127.0.0.1 only. Requires a bearer token stored per-device
// in electron-store. CORS is locked to chrome-extension:// origins.
// Never exposed beyond the loopback interface.

import * as http from "http";
import { randomBytes } from "crypto";
import type Store from "electron-store";
import type { WalletCard, CardID, DetectedApp } from "./types";
import { APP_CARD_MAP } from "./constants";
import { formatCards } from "./injection";

const BRIDGE_HOST = "127.0.0.1";
const BRIDGE_PORT = 9847;

// Map browser host → DetectedApp (to reuse APP_CARD_MAP)
const HOST_TO_APP: Array<[RegExp, DetectedApp]> = [
  [/(^|\.)claude\.ai$/i, "claude"],
  [/(^|\.)chatgpt\.com$/i, "chatgpt"],
  [/(^|\.)chat\.openai\.com$/i, "chatgpt"],
  [/(^|\.)gemini\.google\.com$/i, "gemini"],
  [/(^|\.)bard\.google\.com$/i, "gemini"],
  [/(^|\.)perplexity\.ai$/i, "perplexity"],
  [/(^|\.)copilot\.microsoft\.com$/i, "copilot"],
  [/(^|\.)notion\.so$/i, "notion"],
  [/(^|\.)figma\.com$/i, "figma"],
  [/(^|\.)linear\.app$/i, "linear"],
];

function hostToApp(host: string | undefined | null): DetectedApp {
  if (!host) return "unknown";
  const h = host.toLowerCase();
  for (const [pattern, app] of HOST_TO_APP) {
    if (pattern.test(h)) return app;
  }
  return "unknown";
}

export interface BridgeDeps {
  store: Pick<
    Store<{ cards: WalletCard[]; bridgeToken?: string }>,
    "get" | "set"
  > & {
    get(key: "cards"): WalletCard[];
    get(key: "bridgeToken"): string | undefined;
    set(key: "bridgeToken", value: string): void;
    set(key: "cards", value: WalletCard[]): void;
  };
  onCardUpdate?: (card: WalletCard) => void;
  onInjection?: (info: {
    cardIds: CardID[];
    host: string;
    app: DetectedApp;
  }) => void;
}

export interface BridgeInfo {
  port: number;
  token: string;
  url: string;
}

function getOrCreateToken(store: BridgeDeps["store"]): string {
  let token = store.get("bridgeToken");
  if (!token || typeof token !== "string" || token.length < 32) {
    token = randomBytes(32).toString("hex");
    store.set("bridgeToken", token);
  }
  return token;
}

function json(res: http.ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

function checkAuth(req: http.IncomingMessage, token: string): boolean {
  const header = req.headers["authorization"];
  if (!header || Array.isArray(header)) return false;
  if (!header.startsWith("Bearer ")) return false;
  const provided = header.slice(7);
  // Constant-time compare
  if (provided.length !== token.length) return false;
  let diff = 0;
  for (let i = 0; i < provided.length; i++) {
    diff |= provided.charCodeAt(i) ^ token.charCodeAt(i);
  }
  return diff === 0;
}

function applyCors(res: http.ServerResponse) {
  // Accept any chrome-extension origin plus localhost (for dev tooling).
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, OPTIONS",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Authorization, Content-Type",
  );
}

async function readJsonBody<T = unknown>(
  req: http.IncomingMessage,
): Promise<T | null> {
  return new Promise((resolve) => {
    const chunks: Buffer[] = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      if (chunks.length === 0) return resolve(null);
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf-8")));
      } catch {
        resolve(null);
      }
    });
    req.on("error", () => resolve(null));
  });
}

let server: http.Server | null = null;
let cachedToken = "";

export function startBridge(deps: BridgeDeps): BridgeInfo {
  if (server) {
    return { port: BRIDGE_PORT, token: cachedToken, url: `http://${BRIDGE_HOST}:${BRIDGE_PORT}` };
  }

  const token = getOrCreateToken(deps.store);
  cachedToken = token;

  server = http.createServer(async (req, res) => {
    applyCors(res);

    if (req.method === "OPTIONS") {
      res.statusCode = 204;
      res.end();
      return;
    }

    const url = new URL(req.url || "/", `http://${BRIDGE_HOST}`);
    const path = url.pathname;

    // Public health check — no auth needed, returns bridge presence only.
    if (req.method === "GET" && path === "/health") {
      json(res, 200, { ok: true, name: "wallet", version: 1 });
      return;
    }

    // Everything else needs auth.
    if (!checkAuth(req, token)) {
      json(res, 401, { error: "unauthorized" });
      return;
    }

    // GET /cards → full card list
    if (req.method === "GET" && path === "/cards") {
      const cards = deps.store.get("cards");
      json(res, 200, { cards });
      return;
    }

    // GET /context?host=<host>&task=<text> → relevant cards formatted for injection
    if (req.method === "GET" && path === "/context") {
      const host = url.searchParams.get("host") || "";
      const app = hostToApp(host);
      const relevantIds = APP_CARD_MAP[app] || APP_CARD_MAP.unknown;
      const cards = deps.store.get("cards");
      const relevant = cards.filter(
        (c) => relevantIds.includes(c.id) && c.content.trim().length > 0,
      );
      const text = formatCards(relevant);

      const now = new Date().toISOString();
      const updated = cards.map((c) =>
        relevantIds.includes(c.id) && c.content.trim().length > 0
          ? { ...c, isActive: true, lastInjected: now }
          : c,
      );
      deps.store.set("cards", updated);
      deps.onInjection?.({
        cardIds: relevant.map((c) => c.id),
        host,
        app,
      });

      json(res, 200, {
        app,
        cardIds: relevant.map((c) => c.id),
        text,
        cards: relevant.map((c) => ({
          id: c.id,
          name: c.name,
          content: c.content,
        })),
      });
      return;
    }

    // POST /cards/:id — update a card (used by update_card MCP tool)
    const cardMatch = path.match(/^\/cards\/([a-zA-Z]+)$/);
    if ((req.method === "POST" || req.method === "PUT") && cardMatch) {
      const id = cardMatch[1] as CardID;
      const body = await readJsonBody<{ content?: string; summary?: string }>(req);
      if (!body || typeof body.content !== "string") {
        json(res, 400, { error: "content required" });
        return;
      }
      const cards = deps.store.get("cards");
      const idx = cards.findIndex((c) => c.id === id);
      if (idx === -1) {
        json(res, 404, { error: "card not found" });
        return;
      }
      const updated: WalletCard = {
        ...cards[idx],
        content: body.content,
        summary:
          typeof body.summary === "string" ? body.summary : cards[idx].summary,
        updatedAt: new Date().toISOString(),
      };
      cards[idx] = updated;
      deps.store.set("cards", cards);
      deps.onCardUpdate?.(updated);
      json(res, 200, { card: updated });
      return;
    }

    json(res, 404, { error: "not found" });
  });

  server.listen(BRIDGE_PORT, BRIDGE_HOST, () => {
    console.log(`Wallet bridge listening on http://${BRIDGE_HOST}:${BRIDGE_PORT}`);
  });

  server.on("error", (err) => {
    console.error("Wallet bridge error:", err);
  });

  return {
    port: BRIDGE_PORT,
    token,
    url: `http://${BRIDGE_HOST}:${BRIDGE_PORT}`,
  };
}

export function stopBridge() {
  if (server) {
    server.close();
    server = null;
  }
}

export function getBridgeToken(): string {
  return cachedToken;
}
