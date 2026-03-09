import type { WalletCard } from "./types";

export function formatCards(cards: WalletCard[]): string {
  if (cards.length === 0) return "";

  const lines = [
    "[WALLET CONTEXT]",
    "The following is personal context about the user.",
    "Use it to calibrate your responses appropriately.",
    "",
  ];

  for (const card of cards) {
    const label = card.id
      .replace("currentWork", "CURRENT WORK")
      .toUpperCase();
    lines.push(`${label}: ${card.content}`);
  }

  lines.push("");
  lines.push("[/WALLET CONTEXT]");

  return lines.join("\n");
}
