import { useState, useRef, useEffect } from "react";
import { CardRow } from "./CardRow";
import type { WalletCard } from "@shared/types";

interface CardTrayProps {
  cards: WalletCard[];
  contextActive: boolean;
  onSelectCard: (card: WalletCard) => void;
  onOpenSettings: () => void;
}

export function CardTray({ cards, contextActive, onSelectCard, onOpenSettings }: CardTrayProps) {
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.trim()
    ? cards.filter((c) => {
        const q = query.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.content.toLowerCase().includes(q) ||
          c.summary.toLowerCase().includes(q)
        );
      })
    : cards;

  useEffect(() => {
    if (searching) inputRef.current?.focus();
  }, [searching]);

  // Keyboard: Cmd+F to search, Escape to close search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "f") {
        e.preventDefault();
        setSearching(true);
      } else if (e.key === "Escape" && searching) {
        setSearching(false);
        setQuery("");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [searching]);

  return (
    <div className="flex flex-col h-full">
      {/* Header — 44px */}
      <div
        className="flex items-center justify-between px-3.5 h-11 shrink-0"
        style={{ borderBottom: "1px solid rgba(123, 97, 255, 0.08)" }}
      >
        {searching ? (
          <div className="flex items-center gap-2 flex-1">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-wallet-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search cards..."
              className="glass-input flex-1 bg-transparent px-2 py-1 text-[13px] text-wallet-white placeholder:text-wallet-muted/40 border-none shadow-none"
              style={{ boxShadow: "none" }}
            />
            <button
              onClick={() => { setSearching(false); setQuery(""); }}
              className="text-wallet-muted hover:text-wallet-white transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <>
            <span className="mono text-[11px] text-wallet-cyan tracking-[0.2em]">
              WALLET
            </span>
            <button
              onClick={() => setSearching(true)}
              className="text-wallet-muted hover:text-wallet-white transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Card list */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-px">
          {filtered.length > 0 ? (
            filtered.map((card, i) => (
              <CardRow
                key={card.id}
                card={card}
                index={i}
                onClick={() => onSelectCard(card)}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 mx-3.5">
              <div className="glass rounded-xl px-6 py-5 text-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-wallet-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <span className="text-[12px] text-wallet-muted">No matching cards</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer — 36px, glass surface */}
      <div
        className="flex items-center gap-1.5 px-3.5 h-9 shrink-0"
        style={{
          background: "rgba(19, 20, 30, 0.6)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderTop: "1px solid rgba(255, 255, 255, 0.04)",
        }}
      >
        <div
          className={`w-1.5 h-1.5 rounded-full ${contextActive ? "bg-wallet-green" : "bg-wallet-muted"}`}
          style={contextActive ? { animation: "breathe 2s ease-in-out infinite" } : undefined}
        />
        <span className="mono text-[10px] text-wallet-muted">
          {contextActive ? "CONTEXT ACTIVE" : "CONTEXT PAUSED"}
        </span>
        <div className="flex-1" />
        <button
          onClick={onOpenSettings}
          className="text-wallet-muted hover:text-wallet-white transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>
      </div>
    </div>
  );
}
