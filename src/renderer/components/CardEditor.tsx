import { useState, useEffect } from "react";
import { CardIcon } from "./CardIcon";
import { CARD_META, CARD_EXAMPLES, CARD_ACCENT_COLORS, MAX_CONTENT_LENGTH } from "@shared/constants";
import type { WalletCard } from "@shared/types";

interface CardEditorProps {
  card: WalletCard;
  onSave: (card: WalletCard) => void;
  onClose: () => void;
}

export function CardEditor({ card, onSave, onClose }: CardEditorProps) {
  const [draft, setDraft] = useState(card.content);
  const meta = CARD_META[card.id];
  const accent = CARD_ACCENT_COLORS[card.id];
  const isOverLimit = draft.length > MAX_CONTENT_LENGTH;
  const isEmpty = draft.trim().length === 0;
  const hasChanges = draft !== card.content;

  // Character counter color: muted -> amber -> red
  const charRatio = draft.length / MAX_CONTENT_LENGTH;
  const counterColor = charRatio > 1 ? "#EF4444" : charRatio > 0.9 ? "#F59E0B" : undefined;

  const handleSave = () => {
    if (isEmpty) return;
    onSave({
      ...card,
      content: draft.slice(0, MAX_CONTENT_LENGTH),
      summary: draft.slice(0, 60).replace(/\n/g, " "),
      updatedAt: new Date().toISOString(),
    });
  };

  const handleClose = () => {
    if (hasChanges) {
      if (!window.confirm("You have unsaved changes. Discard?")) return;
    }
    onClose();
  };

  const handleSuggest = () => {
    const example = CARD_EXAMPLES[card.id];
    if (draft.trim().length === 0) {
      setDraft(example);
    } else {
      setDraft(draft + "\n\n" + example);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      } else if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  return (
    <div className="flex flex-col h-full p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <CardIcon name={meta.icon} style={{ color: accent }} size={16} />
          <span className="text-[17px] font-semibold text-wallet-white tracking-tight">
            {card.name}
          </span>
        </div>
        <button
          onClick={handleClose}
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
        className="glass-input flex-1 w-full p-3 text-[14px] text-wallet-white resize-none placeholder:text-wallet-muted/40"
        placeholder={`Write your ${card.name.toLowerCase()} here...`}
        autoFocus
      />

      {/* AI suggest */}
      <div className="mt-3">
        <button
          onClick={handleSuggest}
          className="flex items-center gap-1.5 px-3 py-1.5 text-wallet-purple bg-wallet-purple/10 rounded-full hover:bg-wallet-purple/20 transition-colors"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61z" />
          </svg>
          <span className="mono text-[11px]">
            {isEmpty ? "Use example" : "Add example"} →
          </span>
        </button>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4">
        <span
          className="mono text-[10px] transition-colors duration-300"
          style={{ color: counterColor ?? "var(--color-wallet-muted)" }}
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
