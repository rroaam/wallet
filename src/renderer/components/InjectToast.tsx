import { useEffect, useState } from "react";

interface InjectToastProps {
  visible: boolean;
  cardCount: number;
  onDone: () => void;
}

type Phase = "hidden" | "entering" | "visible" | "exiting";

export function InjectToast({ visible, cardCount, onDone }: InjectToastProps) {
  const [phase, setPhase] = useState<Phase>("hidden");

  useEffect(() => {
    if (visible && phase === "hidden") {
      setPhase("entering");
      // Transition to visible after entrance animation
      const enterTimer = setTimeout(() => setPhase("visible"), 350);
      return () => clearTimeout(enterTimer);
    }

    if (!visible && (phase === "entering" || phase === "visible")) {
      setPhase("exiting");
      const exitTimer = setTimeout(() => {
        setPhase("hidden");
      }, 200);
      return () => clearTimeout(exitTimer);
    }
  }, [visible, phase]);

  // Auto-dismiss after 2s
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onDone, 2000);
      return () => clearTimeout(timer);
    }
  }, [visible, onDone]);

  if (phase === "hidden") return null;

  return (
    <div
      className={`fixed bottom-14 left-1/2 -translate-x-1/2 z-50 ${
        phase === "exiting" ? "animate-toast-exit" : "animate-toast-enter"
      }`}
    >
      <div
        className="flex items-center gap-2 px-4 py-2 rounded-full"
        style={{
          background: "rgba(16, 185, 129, 0.15)",
          border: "1px solid rgba(16, 185, 129, 0.25)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-wallet-green)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            d="M20 6 9 17l-5-5"
            style={{
              strokeDasharray: 24,
              strokeDashoffset: 0,
              animation: phase === "entering" ? "checkmark-draw 0.4s var(--ease-smooth) forwards" : undefined,
            }}
          />
        </svg>
        <span className="mono text-[11px] text-wallet-green">
          {cardCount === 1 ? "Copied to clipboard" : `${cardCount} cards injected`}
        </span>
      </div>
    </div>
  );
}
