import { CardIcon } from "./CardIcon";
import { CARD_META, CARD_ACCENT_COLORS } from "@shared/constants";
import type { WalletCard } from "@shared/types";

interface CardRowProps {
  card: WalletCard;
  index: number;
  onClick: () => void;
}

export function CardRow({ card, index, onClick }: CardRowProps) {
  const meta = CARD_META[card.id];
  const accent = CARD_ACCENT_COLORS[card.id];
  const isFilled = card.content.trim().length > 0;

  // Primary status line: summary > surfacesWhen fallback > "Not set"
  const statusLine = isFilled
    ? card.summary || "Filled"
    : "Not set";

  return (
    <button
      type="button"
      onClick={onClick}
      data-active={card.isActive ? "true" : "false"}
      className="cc-shell flex items-center gap-3 w-full h-[66px] px-3.5 py-3 text-left border-0 outline-none"
      style={{
        animation: `stagger-in 0.35s var(--ease-spring) both`,
        animationDelay: `${index * 35}ms`,
      }}
    >
      {/* Colored icon circle */}
      <div
        className="cc-icon"
        data-empty={!isFilled}
        style={
          isFilled
            ? {
                background: accent,
              }
            : undefined
        }
      >
        <CardIcon name={meta.icon} size={14} style={{ color: "currentColor" }} />
      </div>

      {/* Name + status */}
      <div className="flex flex-col min-w-0 flex-1">
        <span className="text-[13px] font-semibold text-wallet-white leading-[1.2] tracking-[-0.01em] truncate">
          {card.name}
        </span>
        <span className="text-[11px] text-wallet-white/55 leading-[1.2] truncate mt-0.5">
          {statusLine}
        </span>
      </div>

      {/* Active pulse */}
      {card.isActive && (
        <div
          className="w-[6px] h-[6px] rounded-full shrink-0"
          style={{
            background: accent,
            boxShadow: `0 0 10px ${accent}`,
            animation: "breathe 1.8s ease-in-out infinite",
          }}
        />
      )}
    </button>
  );
}
