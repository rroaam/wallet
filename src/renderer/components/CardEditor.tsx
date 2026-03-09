import { useState } from "react";
import { CardIcon } from "./CardIcon";
import { CARD_META, MAX_CONTENT_LENGTH } from "@shared/constants";
import type { WalletCard } from "@shared/types";

interface CardEditorProps {
  card: WalletCard;
  onSave: (card: WalletCard) => void;
  onClose: () => void;
}

export function CardEditor({ card, onSave, onClose }: CardEditorProps) {
  const [draft, setDraft] = useState(card.content);
  const meta = CARD_META[card.id];
  const isOverLimit = draft.length > MAX_CONTENT_LENGTH;
  const isEmpty = draft.trim().length === 0;

  const handleSave = () => {
    if (isEmpty) return;
    onSave({
      ...card,
      content: draft.slice(0, MAX_CONTENT_LENGTH),
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="flex flex-col h-full p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <CardIcon name={meta.icon} className="text-wallet-purple" size={16} />
          <span className="text-[17px] font-semibold text-wallet-white">
            {card.name}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-wallet-muted hover:text-wallet-white transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>

      {/* Prompt hint */}
      <p className="text-[11px] text-wallet-muted mb-3">{meta.prompt}</p>

      {/* Editor */}
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        className="flex-1 w-full p-3 text-[14px] text-wallet-white bg-wallet-surface border border-wallet-border rounded-lg resize-none outline-none focus:border-wallet-purple/50 transition-colors placeholder:text-wallet-muted/40"
        placeholder={`Write your ${card.name.toLowerCase()} here...`}
        autoFocus
      />

      {/* AI suggest */}
      <div className="mt-3">
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-wallet-purple bg-wallet-purple/10 rounded-full hover:bg-wallet-purple/20 transition-colors">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61z" />
          </svg>
          <span className="mono text-[11px]">Suggest →</span>
        </button>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4">
        <span
          className={`mono text-[10px] ${isOverLimit ? "text-wallet-amber" : "text-wallet-muted"}`}
        >
          {draft.length} / {MAX_CONTENT_LENGTH}
        </span>

        <button
          onClick={handleSave}
          disabled={isEmpty}
          className="gradient-btn px-5 py-2 text-[13px] font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Save
        </button>
      </div>
    </div>
  );
}
