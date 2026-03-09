import { writeFileSync, mkdirSync } from "fs";
import path from "path";
import { homedir } from "os";
import type { WalletCard } from "./types";

const WALLET_DIR = path.join(
  homedir(),
  "Library",
  "Application Support",
  "Wallet"
);
const CARDS_FILE = path.join(WALLET_DIR, "cards.json");

export function syncCardsForMCP(cards: WalletCard[]): void {
  try {
    mkdirSync(WALLET_DIR, { recursive: true });
    writeFileSync(CARDS_FILE, JSON.stringify(cards, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to sync cards for MCP:", err);
  }
}
