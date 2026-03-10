import { useState, useEffect, useCallback } from "react";
import type { WalletCard, CardID, InjectionEvent } from "@shared/types";

export function useCards() {
  const [cards, setCards] = useState<WalletCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastInjection, setLastInjection] = useState<InjectionEvent | null>(null);

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

    // Listen for card updates from main process
    const unsubCards = window.wallet.onCardsUpdated((updated) => {
      setCards(updated);
    });

    // Listen for injection events
    const unsubInjection = window.wallet.onInjection((event) => {
      setLastInjection(event);
    });

    return () => {
      unsubCards();
      unsubInjection();
    };
  }, [fetchCards]);

  const updateCard = useCallback(async (card: WalletCard) => {
    const updated = await window.wallet.updateCard(card);
    setCards(updated);
  }, []);

  const injectCard = useCallback(async (cardId: CardID) => {
    const updated = await window.wallet.injectCard(cardId);
    if (updated) setCards(updated);
  }, []);

  return { cards, loading, updateCard, injectCard, lastInjection, refetch: fetchCards };
}
