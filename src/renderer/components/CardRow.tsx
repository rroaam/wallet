import { CardIcon } from "./CardIcon";
import { CARD_META } from "@shared/constants";
import type { WalletCard } from "@shared/types";

interface CardRowProps {
  card: WalletCard;
  onClick: () => void;
}

export function CardRow({ card, onClick }: CardRowProps) {
  const meta = CARD_META[card.id];

  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-3 w-full px-3.5 py-2.5 h-[52px] text-left
        transition-all duration-150 ease-out
        hover:bg-wallet-surface/60
        ${card.isActive ? "bg-wallet-purple/[0.06]" : ""}
      `}
      style={
        card.isActive
          ? {
              boxShadow: "inset 0 0 0 1px transparent",
              borderImage:
                "linear-gradient(to right, #7B61FF, #00D9E8) 1",
            }
          : undefined
      }
    >
      {/* Icon */}
      <div className="w-6 flex items-center justify-center shrink-0">
        <CardIcon name={meta.icon} className="text-wallet-purple/70" size={16} />
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
        <div className="w-[5px] h-[5px] rounded-full bg-wallet-cyan animate-pulse shrink-0" />
      )}

      {/* Tag */}
      <span className="mono text-[10px] text-wallet-muted/50 shrink-0">
        {meta.tag}
      </span>
    </button>
  );
}
