import { useState } from "react";
import { CardIcon } from "./CardIcon";
import { CARD_META, CARD_EXAMPLES, CARD_ACCENT_COLORS, MAX_CONTENT_LENGTH } from "@shared/constants";
import type { WalletCard } from "@shared/types";

interface OnboardingProps {
  identityCard: WalletCard;
  onComplete: (updatedCard: WalletCard) => void;
}

const TOTAL_STEPS = 3;

export function Onboarding({ identityCard, onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState("");
  const meta = CARD_META["identity"];
  const accent = CARD_ACCENT_COLORS.identity;

  const handleFinish = () => {
    const updated: WalletCard = {
      ...identityCard,
      content: draft.slice(0, MAX_CONTENT_LENGTH),
      summary: draft.slice(0, 60).replace(/\n/g, " "),
      updatedAt: new Date().toISOString(),
    };
    onComplete(updated);
  };

  return (
    <div className="flex flex-col h-full">
      {/* ── Top chrome: step indicator ─────────────────────────── */}
      <div className="cc-chrome flex items-center justify-center h-12 shrink-0 relative">
        <div className="flex items-center gap-1.5">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === step ? 18 : 5,
                height: 5,
                background:
                  i === step
                    ? "rgba(255,255,255,0.9)"
                    : i < step
                      ? "rgba(255,255,255,0.45)"
                      : "rgba(255,255,255,0.15)",
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Screen 1: Welcome ──────────────────────────────────── */}
      {step === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center view-fade">
          <div
            className="w-[72px] h-[72px] rounded-[20px] flex items-center justify-center mb-8"
            style={{
              background:
                "linear-gradient(135deg, #7B8FFF 0%, #5BA9FF 100%)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.25), 0 10px 30px rgba(91,169,255,0.35), 0 0 0 0.5px rgba(255,255,255,0.2)",
              animation: "fade-in 0.5s var(--ease-spring)",
            }}
          >
            <span
              className="text-[38px] font-bold text-white leading-none"
              style={{ letterSpacing: "-0.03em" }}
            >
              W
            </span>
          </div>

          <h1 className="text-[24px] font-semibold text-wallet-white leading-[1.15] tracking-[-0.02em] mb-3 max-w-[260px]">
            Your AI tools will
            <br />
            just know you.
          </h1>

          <p className="text-[13px] text-white/55 leading-[1.55] max-w-[260px] mb-8">
            Wallet stores eight cards about who you are and auto-injects them
            into Claude, ChatGPT, Cursor, and more. Never explain yourself
            twice.
          </p>
        </div>
      )}

      {/* ── Screen 2: Identity input ───────────────────────────── */}
      {step === 1 && (
        <div className="flex-1 flex flex-col px-5 pt-5 pb-3 view-forward">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="cc-icon" style={{ background: accent, width: 24, height: 24 }}>
              <CardIcon name={meta.icon} size={12} style={{ color: "#ffffff" }} />
            </div>
            <span className="text-[15px] font-semibold text-wallet-white tracking-[-0.01em]">
              Let's start with you
            </span>
          </div>

          <p className="text-[12px] text-white/55 mb-3 leading-[1.45]">
            {meta.prompt}
          </p>

          <div className="cc-shell flex-1 flex flex-col overflow-hidden mb-3">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="flex-1 w-full p-3.5 text-[13px] text-wallet-white resize-none placeholder:text-white/30 bg-transparent border-none outline-none leading-[1.55]"
              placeholder="e.g. Jane Smith — product designer and startup founder. 8 years building consumer apps…"
              autoFocus
            />
          </div>

          <div className="flex items-center justify-between">
            <span
              className={`mono text-[10px] ${
                draft.length > MAX_CONTENT_LENGTH
                  ? "text-wallet-amber"
                  : "text-white/40"
              }`}
            >
              {draft.length}/{MAX_CONTENT_LENGTH}
            </span>

            {draft.trim().length === 0 && (
              <button
                onClick={() => setDraft(CARD_EXAMPLES.identity)}
                className="text-[11px] text-white/55 hover:text-white transition-colors"
              >
                Use example
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Screen 3: Completion ───────────────────────────────── */}
      {step === 2 && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center view-fade">
          <div
            className="w-[72px] h-[72px] rounded-full flex items-center justify-center mb-7"
            style={{
              background: "rgba(48, 209, 88, 0.18)",
              boxShadow:
                "inset 0 0 0 0.5px rgba(48, 209, 88, 0.4), 0 0 40px rgba(48, 209, 88, 0.15)",
              animation: "fade-in 0.4s var(--ease-spring)",
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#30D158"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                d="M20 6 9 17l-5-5"
                style={{
                  strokeDasharray: 24,
                  strokeDashoffset: 0,
                  animation:
                    "checkmark-draw 0.5s var(--ease-smooth) forwards",
                }}
              />
            </svg>
          </div>

          <h1 className="text-[22px] font-semibold text-wallet-white leading-[1.15] tracking-[-0.02em] mb-3">
            You're all set.
          </h1>

          <p className="text-[13px] text-white/55 leading-[1.55] max-w-[260px] mb-6">
            Your Identity card is saved. Fill in the other seven when you're
            ready — the more you add, the better your tools understand you.
          </p>

          <div className="flex flex-wrap justify-center gap-1.5 max-w-[260px] mb-4">
            {(["voice", "expertise", "currentWork", "audience", "aesthetic", "narrative", "goals"] as const).map(
              (id, i) => (
                <span
                  key={id}
                  className="text-[10px] text-white/60 bg-white/5 px-2 py-1 rounded-full border border-white/10"
                  style={{
                    animation: `stagger-in 0.3s var(--ease-spring) both`,
                    animationDelay: `${120 + i * 40}ms`,
                  }}
                >
                  {CARD_META[id].name}
                </span>
              ),
            )}
          </div>
        </div>
      )}

      {/* ── Bottom CTA bar ─────────────────────────────────────── */}
      <div className="px-5 pb-5 pt-3 shrink-0">
        {step === 0 && (
          <>
            <button
              onClick={() => setStep(1)}
              className="w-full h-11 rounded-xl bg-wallet-white text-wallet-bg text-[14px] font-semibold tracking-[-0.01em] hover:opacity-90 active:scale-[0.98] transition-all"
            >
              Get started
            </button>
            <p className="text-center mono text-[10px] text-white/35 mt-3">
              Takes 60 seconds
            </p>
          </>
        )}

        {step === 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setStep(2)}
              className="flex-1 h-11 rounded-xl text-[13px] text-white/55 hover:text-white hover:bg-white/[0.04] transition-all"
            >
              Skip for now
            </button>
            <button
              onClick={() => setStep(2)}
              disabled={draft.trim().length === 0}
              className="flex-1 h-11 rounded-xl bg-wallet-white text-wallet-bg text-[14px] font-semibold tracking-[-0.01em] hover:opacity-90 active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <button
            onClick={handleFinish}
            className="w-full h-11 rounded-xl bg-wallet-white text-wallet-bg text-[14px] font-semibold tracking-[-0.01em] hover:opacity-90 active:scale-[0.98] transition-all"
          >
            Open Wallet
          </button>
        )}
      </div>
    </div>
  );
}
