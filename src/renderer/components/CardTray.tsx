import { CardRow } from "./CardRow";
import type { WalletCard } from "@shared/types";

interface CardTrayProps {
  cards: WalletCard[];
  walletState: string;
  onSelectCard: (card: WalletCard) => void;
}

export function CardTray({ cards, walletState, onSelectCard }: CardTrayProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header — 44px */}
      <div className="flex items-center justify-between px-3.5 h-11 shrink-0">
        <span className="mono text-[11px] text-wallet-cyan tracking-wider">
          WALLET
        </span>
        <div className="flex items-center gap-2">
          <button className="text-wallet-muted hover:text-wallet-white transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
        </div>
      </div>

      {/* Card list */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-px">
          {cards.map((card) => (
            <CardRow
              key={card.id}
              card={card}
              onClick={() => onSelectCard(card)}
            />
          ))}
        </div>
      </div>

      {/* Footer — 36px */}
      <div className="flex items-center gap-1.5 px-3.5 h-9 shrink-0 bg-wallet-surface/50">
        <div className="w-1.5 h-1.5 rounded-full bg-wallet-green animate-pulse" />
        <span className="mono text-[10px] text-wallet-muted">
          CONTEXT ACTIVE
        </span>
        <div className="flex-1" />
        <button className="text-wallet-muted hover:text-wallet-white transition-colors">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>
      </div>
    </div>
  );
}
