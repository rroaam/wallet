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

// Determines CSS animation class based on navigation direction
function transitionClass(from: View, to: View): string {
  if (to === "onboarding") return "view-fade";
  if (from === "tray" && (to === "detail" || to === "settings")) return "view-forward";
  if (from === "detail" && to === "editor") return "view-forward";
  if ((from === "detail" || from === "settings") && to === "tray") return "view-back";
  if (from === "editor" && to === "detail") return "view-back";
  return "view-fade";
}

export function App() {
  const { cards, loading, updateCard, injectCard, lastInjection } = useCards();
  const [view, setView] = useState<View>("loading");
  const [prevView, setPrevView] = useState<View>("loading");
  const [selectedCard, setSelectedCard] = useState<WalletCard | null>(null);
  const [editingCard, setEditingCard] = useState<WalletCard | null>(null);
  const [contextActive, setContextActive] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastCardCount, setToastCardCount] = useState(0);

  const navigate = useCallback((to: View) => {
    setPrevView(view);
    setView(to);
  }, [view]);

  const toggleContext = useCallback(async () => {
    const next = !contextActive;
    setContextActive(next);
    await window.wallet.setContextActive(next);
  }, [contextActive]);

  // Check onboarding on mount
  useEffect(() => {
    if (!loading) {
      window.wallet.getOnboardingComplete().then((complete) => {
        navigate(complete ? "tray" : "onboarding");
      });
    }
  }, [loading]);

  // Listen for tray state events
  useEffect(() => {
    const unsub = window.wallet.onTrayState(() => {});
    return unsub;
  }, []);

  // Show toast on ambient injection events
  useEffect(() => {
    if (lastInjection) {
      setToastCardCount(lastInjection.cardIds.length);
      setShowToast(true);
    }
  }, [lastInjection]);

  // Escape key navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (view === "detail") {
          setSelectedCard(null);
          navigate("tray");
        } else if (view === "settings") {
          navigate("tray");
        }
        // editor handles its own Escape (unsaved changes guard)
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [view, navigate]);

  // Sync selected card with updated cards list
  useEffect(() => {
    if (selectedCard) {
      const updated = cards.find((c) => c.id === selectedCard.id);
      if (updated) setSelectedCard(updated);
    }
  }, [cards]);

  const anim = transitionClass(prevView, view);

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
      <div className={`h-screen bg-wallet-bg overflow-hidden ${anim}`}>
        <Onboarding
          identityCard={identityCard}
          onComplete={async (updated) => {
            await updateCard(updated);
            await window.wallet.setOnboardingComplete();
            navigate("tray");
          }}
        />
      </div>
    );
  }

  // Settings
  if (view === "settings") {
    return (
      <div className={`h-screen bg-wallet-bg overflow-hidden ${anim}`}>
        <Settings
          onBack={() => navigate("tray")}
          contextActive={contextActive}
          onToggleContext={toggleContext}
        />
      </div>
    );
  }

  // Editor
  if (view === "editor" && editingCard) {
    return (
      <div className={`h-screen bg-wallet-bg overflow-hidden ${anim}`}>
        <CardEditor
          card={editingCard}
          onSave={(updated) => {
            updateCard(updated);
            setEditingCard(null);
            navigate("detail");
          }}
          onClose={() => {
            setEditingCard(null);
            navigate("detail");
          }}
        />
      </div>
    );
  }

  // Detail
  if (view === "detail" && selectedCard) {
    return (
      <div className={`h-screen bg-wallet-bg overflow-hidden ${anim}`}>
        <CardDetail
          card={selectedCard}
          onBack={() => {
            setSelectedCard(null);
            navigate("tray");
          }}
          onEdit={() => {
            setEditingCard(selectedCard);
            navigate("editor");
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
    <div className={`h-screen bg-wallet-bg overflow-hidden ${anim}`}>
      <CardTray
        cards={cards}
        contextActive={contextActive}
        onSelectCard={(card) => {
          setSelectedCard(card);
          navigate("detail");
        }}
        onOpenSettings={() => navigate("settings")}
      />
      <InjectToast
        visible={showToast}
        cardCount={toastCardCount}
        onDone={() => setShowToast(false)}
      />
    </div>
  );
}
