import { useEffect } from "react";

interface InjectToastProps {
  visible: boolean;
  cardCount: number;
  onDone: () => void;
}

export function InjectToast({ visible, cardCount, onDone }: InjectToastProps) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onDone, 2000);
      return () => clearTimeout(timer);
    }
  }, [visible, onDone]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-14 left-1/2 -translate-x-1/2 z-50 animate-toast-in">
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-wallet-green/20 border border-wallet-green/30 backdrop-blur-sm">
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
          <path d="M20 6 9 17l-5-5" />
        </svg>
        <span className="mono text-[11px] text-wallet-green">
          {cardCount === 1 ? "Copied to clipboard" : `${cardCount} cards injected`}
        </span>
      </div>
    </div>
  );
}
