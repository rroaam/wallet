import { useState, useEffect } from "react";
import { useCards } from "./hooks/useCards";
import { CardTray } from "./components/CardTray";
import { CardDetail } from "./components/CardDetail";
import { CardEditor } from "./components/CardEditor";
import type { WalletCard } from "@shared/types";

export function App() {
  const { cards, loading, updateCard, injectCard } = useCards();
  const [selectedCard, setSelectedCard] = useState<WalletCard | null>(null);
  const [editingCard, setEditingCard] = useState<WalletCard | null>(null);
  const [walletState, setWalletState] = useState<string>("idle");

  useEffect(() => {
    const unsub = window.wallet.onTrayState((state) => {
      setWalletState(state);
    });
    return unsub;
  }, []);

  // Sync selected card with updated cards list
  useEffect(() => {
    if (selectedCard) {
      const updated = cards.find((c) => c.id === selectedCard.id);
      if (updated) setSelectedCard(updated);
    }
  }, [cards, selectedCard]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-wallet-bg">
        <div className="mono text-[11px] text-wallet-muted">Loading...</div>
      </div>
    );
  }

  // Editor overlay
  if (editingCard) {
    return (
      <div className="h-screen bg-wallet-bg overflow-hidden">
        <CardEditor
          card={editingCard}
          onSave={(updated) => {
            updateCard(updated);
            setEditingCard(null);
          }}
          onClose={() => setEditingCard(null)}
        />
      </div>
    );
  }

  // Detail view
  if (selectedCard) {
    return (
      <div className="h-screen bg-wallet-bg overflow-hidden animate-slide-in">
        <CardDetail
          card={selectedCard}
          onBack={() => setSelectedCard(null)}
          onEdit={() => setEditingCard(selectedCard)}
          onInject={() => injectCard(selectedCard.id)}
        />
      </div>
    );
  }

  // Main tray
  return (
    <div className="h-screen bg-wallet-bg overflow-hidden">
      <CardTray
        cards={cards}
        walletState={walletState}
        onSelectCard={setSelectedCard}
      />
    </div>
  );
}
