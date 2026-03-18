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

  return (
    <button
      onClick={onClick}
      className={`
        glass-row flex items-center gap-3 w-full px-3.5 py-2.5 h-[52px] text-left
        ${card.isActive ? "bg-wallet-purple/[0.06]" : ""}
      `}
      style={{
        borderLeft: `2px solid ${accent}`,
        animation: `stagger-in 0.3s var(--ease-spring) both`,
        animationDelay: `${index * 40}ms`,
        ...(card.isActive
          ? {
              boxShadow: "inset 0 0 0 1px transparent",
              borderImage:
                `linear-gradient(to right, ${accent}, var(--color-wallet-cyan)) 1`,
            }
          : {}),
      }}
    >
      {/* Icon */}
      <div className="w-6 flex items-center justify-center shrink-0">
        <CardIcon name={meta.icon} style={{ color: accent }} size={16} />
      </div>

      {/* Labels */}
      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <span className="text-[13px] font-medium text-wallet-white truncate">
          {card.name}
        </span>
        <span className="mono text-[11px] text-wallet-muted truncate">
          {card.summary || meta.surfacesWhen}
        </span>
      </div>

      {/* Active indicator */}
      {card.isActive && (
        <div
          className="w-[5px] h-[5px] rounded-full bg-wallet-cyan shrink-0"
          style={{ animation: "breathe 2s ease-in-out infinite" }}
        />
      )}

      {/* Tag */}
      <span className="mono text-[10px] text-wallet-muted/50 shrink-0 uppercase tracking-widest">
        {meta.tag}
      </span>
    </button>
  );
}
