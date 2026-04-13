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

  const filledCount = cards.filter((c) => c.content.trim().length > 0).length;

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
      {/* ── Chrome bar ─────────────────────────────────────────── */}
      <div className="cc-chrome flex items-center justify-between px-5 h-12 shrink-0">
        {searching ? (
          <div className="flex items-center gap-2 flex-1">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="flex-1 bg-transparent px-1 py-1 text-[13px] text-wallet-white placeholder:text-white/30 border-none outline-none"
            />
            <button
              onClick={() => {
                setSearching(false);
                setQuery("");
              }}
              className="text-white/50 hover:text-white transition-colors"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-baseline gap-2">
              <span className="text-[15px] font-semibold text-wallet-white tracking-[-0.01em]">
                Wallet
              </span>
              <span className="text-[11px] text-white/40 font-medium">
                {filledCount}/8
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setSearching(true)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-white/55 hover:text-white hover:bg-white/[0.08] transition-all"
                title="Search (⌘F)"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </button>
              <button
                onClick={onOpenSettings}
                className="w-7 h-7 rounded-full flex items-center justify-center text-white/55 hover:text-white hover:bg-white/[0.08] transition-all"
                title="Settings"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>

      {/* ── Cell grid ──────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-3 pt-3 pb-2">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {filtered.map((card, i) => (
              <CardRow
                key={card.id}
                card={card}
                index={i}
                onClick={() => onSelectCard(card)}
              />
            ))}
          </div>
        ) : (
          <div className="cc-shell p-6 flex flex-col items-center justify-center text-center gap-2 mt-4">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <span className="text-[12px] text-white/45">No matching cards</span>
          </div>
        )}
      </div>

      {/* ── Context engine status ─────────────────────────────── */}
      <div className="px-3 pb-3 shrink-0">
        <div className="cc-shell flex items-center gap-3 px-4 h-11">
          <div
            className="w-2 h-2 rounded-full shrink-0"
            style={{
              background: contextActive ? "#30D158" : "rgba(255,255,255,0.3)",
              boxShadow: contextActive
                ? "0 0 8px rgba(48,209,88,0.6)"
                : undefined,
              animation: contextActive
                ? "breathe 2s ease-in-out infinite"
                : undefined,
            }}
          />
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[12px] font-semibold text-wallet-white leading-[1.2] tracking-[-0.01em]">
              Context Engine
            </span>
            <span className="text-[10px] text-white/50 leading-[1.2] mt-0.5">
              {contextActive ? "Auto-injecting on app switch" : "Paused"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
