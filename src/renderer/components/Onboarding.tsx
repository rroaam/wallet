import { useState } from "react";
import { CardIcon } from "./CardIcon";
import { CARD_META, MAX_CONTENT_LENGTH } from "@shared/constants";
import type { WalletCard } from "@shared/types";

interface OnboardingProps {
  identityCard: WalletCard;
  onComplete: (updatedCard: WalletCard) => void;
}

export function Onboarding({ identityCard, onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState("");
  const meta = CARD_META["identity"];

  const handleFinish = () => {
    const updated: WalletCard = {
      ...identityCard,
      content: draft.slice(0, MAX_CONTENT_LENGTH),
      summary: draft.slice(0, 60).replace(/\n/g, " "),
      updatedAt: new Date().toISOString(),
    };
    onComplete(updated);
  };

  // Screen 1: Value prop
  if (step === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-wallet-purple to-wallet-cyan flex items-center justify-center mb-6">
          <span className="text-[22px] font-bold text-white">W</span>
        </div>

        <h1 className="text-[22px] font-bold text-wallet-white mb-2 leading-tight">
          Your AI tools will<br />
          <span className="gradient-text">just know you.</span>
        </h1>

        <p className="text-[13px] text-wallet-muted leading-relaxed mb-8 max-w-[260px]">
          Wallet stores 8 personal context cards and auto-injects them into Claude, ChatGPT, Cursor, and more. Never explain yourself twice.
        </p>

        <button
          onClick={() => setStep(1)}
          className="gradient-btn px-8 py-3 text-[14px] font-semibold"
        >
          Get Started
        </button>

        <span className="mono text-[10px] text-wallet-muted/40 mt-4">
          takes 60 seconds
        </span>
      </div>
    );
  }

  // Screen 2: Identity card editor
  if (step === 1) {
    return (
      <div className="flex flex-col h-full px-5 pt-6 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <CardIcon name={meta.icon} className="text-wallet-purple" size={18} />
          <span className="text-[15px] font-semibold text-wallet-white">
            Let's start with you
          </span>
        </div>

        <p className="text-[12px] text-wallet-muted mb-4">
          {meta.prompt}
        </p>

        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="flex-1 w-full p-3 text-[14px] text-wallet-white bg-wallet-surface border border-wallet-border rounded-lg resize-none outline-none focus:border-wallet-purple/50 transition-colors placeholder:text-wallet-muted/40"
          placeholder="e.g. Ryan Rosenthal — UI/UX designer and product builder. I make creative work faster and AI more useful for non-technical people."
          autoFocus
        />

        <div className="flex items-center justify-between mt-3">
          <span className={`mono text-[10px] ${draft.length > MAX_CONTENT_LENGTH ? "text-wallet-amber" : "text-wallet-muted"}`}>
            {draft.length} / {MAX_CONTENT_LENGTH}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setStep(2)}
              className="text-[12px] text-wallet-muted hover:text-wallet-white transition-colors"
            >
              Skip for now
            </button>
            <button
              onClick={() => setStep(2)}
              disabled={draft.trim().length === 0}
              className="gradient-btn px-5 py-2 text-[13px] font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Screen 3: Completion
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center">
      <div className="w-14 h-14 rounded-full bg-wallet-green/20 flex items-center justify-center mb-5">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-wallet-green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>

      <h1 className="text-[20px] font-bold text-wallet-white mb-2">
        You're all set.
      </h1>

      <p className="text-[13px] text-wallet-muted leading-relaxed mb-2 max-w-[260px]">
        Your Identity card is saved. Fill out the other 7 cards whenever you're ready — the more you add, the better your AI tools understand you.
      </p>

      <div className="flex flex-wrap justify-center gap-1.5 mb-6 max-w-[260px]">
        {(["voice", "expertise", "currentWork", "audience", "aesthetic", "narrative", "goals"] as const).map((id) => (
          <span key={id} className="mono text-[9px] text-wallet-muted/60 bg-wallet-surface px-2 py-0.5 rounded-full">
            {CARD_META[id].name}
          </span>
        ))}
      </div>

      <button
        onClick={handleFinish}
        className="gradient-btn px-8 py-3 text-[14px] font-semibold"
      >
        Open Wallet
      </button>
    </div>
  );
}
