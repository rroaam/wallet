import { CardIcon } from "./CardIcon";
import { CARD_META } from "@shared/constants";
import type { WalletCard } from "@shared/types";

interface CardDetailProps {
  card: WalletCard;
  onBack: () => void;
  onEdit: () => void;
  onInject: () => void;
}

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function CardDetail({ card, onBack, onEdit, onInject }: CardDetailProps) {
  const meta = CARD_META[card.id];

  return (
    <div className="flex flex-col h-full">
      {/* Header — 44px */}
      <div className="flex items-center justify-between px-3.5 h-11 shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-wallet-muted hover:text-wallet-white transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          <span className="text-[13px]">Back</span>
        </button>

        <span className="text-[13px] font-semibold text-wallet-white">
          {card.name}
        </span>

        <button
          onClick={onEdit}
          className="text-wallet-muted hover:text-wallet-white transition-colors"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
          </svg>
        </button>
      </div>

      <div className="h-px bg-wallet-border" />

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-3.5 py-3">
        {/* Icon + name */}
        <div className="flex items-center gap-2.5 mb-4">
          <CardIcon name={meta.icon} className="text-wallet-purple" size={20} />
          <div>
            <h2 className="text-[17px] font-semibold text-wallet-white">
              {card.name}
            </h2>
            <span className="mono text-[10px] text-wallet-muted">
              {meta.tag}
            </span>
          </div>
        </div>

        {/* Content text */}
        {card.content.trim().length > 0 ? (
          <p className="text-[13px] text-wallet-white/85 leading-relaxed mb-4">
            {card.content}
          </p>
        ) : (
          <div className="glass rounded-lg px-4 py-6 mb-4 text-center">
            <p className="text-[13px] text-wallet-muted">
              No content yet. Tap edit to add your context.
            </p>
          </div>
        )}

        {/* Metadata */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-wallet-muted">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="m16 12-4-4v8z" />
            </svg>
            <span className="mono text-[10px]">
              Last injected: {card.lastInjected ? timeAgo(card.lastInjected) : "Never"}
            </span>
          </div>
          <span className="mono text-[10px] text-wallet-muted/60">
            Surfaces when: {meta.surfacesWhen}
          </span>
        </div>
      </div>

      {/* Inject button */}
      <div className="px-4 pb-3 shrink-0">
        {card.content.trim().length > 0 ? (
          <button
            onClick={onInject}
            className="gradient-btn w-full h-12 flex flex-col items-center justify-center"
          >
            <span className="text-[13px] font-semibold">Inject Context</span>
            {card.lastInjected && (
              <span className="mono text-[10px] opacity-50">
                Last injected {timeAgo(card.lastInjected)}
              </span>
            )}
          </button>
        ) : (
          <div className="w-full h-12 flex items-center justify-center rounded-full bg-wallet-surface border border-wallet-border">
            <span className="text-[12px] text-wallet-muted">Add content to inject</span>
          </div>
        )}
      </div>
    </div>
  );
}
