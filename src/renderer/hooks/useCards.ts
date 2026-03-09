import { useState, useEffect, useCallback } from "react";
import type { WalletCard, CardID } from "@shared/types";

export function useCards() {
  const [cards, setCards] = useState<WalletCard[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCards = useCallback(async () => {
    try {
      const data = await window.wallet.getCards();
      setCards(data);
    } catch (err) {
      console.error("Failed to fetch cards:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCards();

    // Listen for updates from main process
    const unsub = window.wallet.onCardsUpdated((updated) => {
      setCards(updated);
    });

    return unsub;
  }, [fetchCards]);

  const updateCard = useCallback(async (card: WalletCard) => {
    const updated = await window.wallet.updateCard(card);
    setCards(updated);
  }, []);

  const injectCard = useCallback(async (cardId: CardID) => {
    const updated = await window.wallet.injectCard(cardId);
    if (updated) setCards(updated);
  }, []);

  return { cards, loading, updateCard, injectCard, refetch: fetchCards };
}
