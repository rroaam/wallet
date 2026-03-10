import { useState, useEffect, useCallback } from "react";
import { useCards } from "./hooks/useCards";
import { CardTray } from "./components/CardTray";
import { CardDetail } from "./components/CardDetail";
import { CardEditor } from "./components/CardEditor";
import { Onboarding } from "./components/Onboarding";
import { Settings } from "./components/Settings";
import { InjectToast } from "./components/InjectToast";
import type { WalletCard } from "@shared/types";

type View = "loading" | "onboarding" | "tray" | "detail" | "editor" | "settings";

export function App() {
  const { cards, loading, updateCard, injectCard, lastInjection } = useCards();
  const [view, setView] = useState<View>("loading");
  const [selectedCard, setSelectedCard] = useState<WalletCard | null>(null);
  const [editingCard, setEditingCard] = useState<WalletCard | null>(null);
  const [contextActive, setContextActive] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastCardCount, setToastCardCount] = useState(0);

  const toggleContext = useCallback(async () => {
    const next = !contextActive;
    setContextActive(next);
    await window.wallet.setContextActive(next);
  }, [contextActive]);

  // Check onboarding on mount
  useEffect(() => {
    if (!loading) {
      window.wallet.getOnboardingComplete().then((complete) => {
        setView(complete ? "tray" : "onboarding");
      });
    }
  }, [loading]);

  // Listen for tray state events
  useEffect(() => {
    const unsub = window.wallet.onTrayState(() => {
      // Could use for animations later
    });
    return unsub;
  }, []);

  // Show toast on injection events (ambient)
  useEffect(() => {
    if (lastInjection) {
      setToastCardCount(lastInjection.cardIds.length);
      setShowToast(true);
    }
  }, [lastInjection]);

  // Sync selected card with updated cards list
  useEffect(() => {
    if (selectedCard) {
      const updated = cards.find((c) => c.id === selectedCard.id);
      if (updated) setSelectedCard(updated);
    }
  }, [cards, selectedCard]);

  // Loading
  if (view === "loading" || loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-wallet-bg">
        <div className="mono text-[11px] text-wallet-muted">Loading...</div>
      </div>
    );
  }

  // Onboarding
  if (view === "onboarding") {
    const identityCard = cards.find((c) => c.id === "identity");
    if (!identityCard) return null;

    return (
      <div className="h-screen bg-wallet-bg overflow-hidden">
        <Onboarding
          identityCard={identityCard}
          onComplete={async (updated) => {
            await updateCard(updated);
            await window.wallet.setOnboardingComplete();
            setView("tray");
          }}
        />
      </div>
    );
  }

  // Settings
  if (view === "settings") {
    return (
      <div className="h-screen bg-wallet-bg overflow-hidden">
        <Settings
          onBack={() => setView("tray")}
          contextActive={contextActive}
          onToggleContext={toggleContext}
        />
      </div>
    );
  }

  // Editor
  if (view === "editor" && editingCard) {
    return (
      <div className="h-screen bg-wallet-bg overflow-hidden">
        <CardEditor
          card={editingCard}
          onSave={(updated) => {
            updateCard(updated);
            setEditingCard(null);
            setView("detail");
          }}
          onClose={() => {
            setEditingCard(null);
            setView("detail");
          }}
        />
      </div>
    );
  }

  // Detail
  if (view === "detail" && selectedCard) {
    return (
      <div className="h-screen bg-wallet-bg overflow-hidden">
        <CardDetail
          card={selectedCard}
          onBack={() => {
            setSelectedCard(null);
            setView("tray");
          }}
          onEdit={() => {
            setEditingCard(selectedCard);
            setView("editor");
          }}
          onInject={async () => {
            await injectCard(selectedCard.id);
            setToastCardCount(1);
            setShowToast(true);
          }}
        />
        <InjectToast
          visible={showToast}
          cardCount={toastCardCount}
          onDone={() => setShowToast(false)}
        />
      </div>
    );
  }

  // Tray (default)
  return (
    <div className="h-screen bg-wallet-bg overflow-hidden">
      <CardTray
        cards={cards}
        contextActive={contextActive}
        onSelectCard={(card) => {
          setSelectedCard(card);
          setView("detail");
        }}
        onOpenSettings={() => setView("settings")}
      />
      <InjectToast
        visible={showToast}
        cardCount={toastCardCount}
        onDone={() => setShowToast(false)}
      />
    </div>
  );
}
