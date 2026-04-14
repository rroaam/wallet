import { useEffect, useState } from "react";

interface SettingsProps {
  onBack: () => void;
  contextActive: boolean;
  onToggleContext: () => void;
}

type BridgeInfo = { port: number; token: string; url: string } | null;

export function Settings({ onBack, contextActive, onToggleContext }: SettingsProps) {
  const [bridge, setBridge] = useState<BridgeInfo>(null);
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    window.wallet.getBridgeInfo().then((info) => {
      if (!cancelled) setBridge(info);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function copyToken() {
    if (!bridge) return;
    try {
      await navigator.clipboard.writeText(bridge.token);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  const maskedToken = bridge
    ? `${bridge.token.slice(0, 4)}${"•".repeat(24)}${bridge.token.slice(-4)}`
    : "";

  return (
    <div className="flex flex-col h-full">
      {/* Header — Control Center chrome bar */}
      <div className="cc-chrome flex items-center justify-between px-5 h-12 shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-white/55 hover:text-white transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          <span className="text-[13px] font-medium">Back</span>
        </button>

        <span className="text-[13px] font-semibold text-wallet-white tracking-[-0.01em]">
          Settings
        </span>

        <div className="w-10" />
      </div>

      {/* Settings list */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2.5">
        {/* Section label */}
        <span className="mono text-[9px] text-wallet-muted/60 uppercase tracking-[0.15em] px-1">
          Engine
        </span>

        {/* Context Engine toggle — glass card */}
        <div className="cc-shell px-3.5 py-3 flex items-center justify-between">
          <div>
            <span className="text-[13px] text-wallet-white">Context Engine</span>
            <p className="text-[11px] text-wallet-muted mt-0.5">
              Auto-inject cards on app switch
            </p>
          </div>
          <button
            onClick={onToggleContext}
            className="relative w-10 h-[22px] rounded-full transition-all duration-200"
            style={{
              background: contextActive ? "var(--color-wallet-green)" : "var(--color-wallet-surface)",
              border: contextActive ? "none" : "1px solid var(--color-wallet-border)",
              boxShadow: contextActive
                ? "inset 0 1px 2px rgba(0,0,0,0.15), 0 0 8px rgba(16,185,129,0.3)"
                : "inset 0 1px 2px rgba(0,0,0,0.15)",
            }}
          >
            <div
              className="absolute top-[2px] w-[18px] h-[18px] rounded-full bg-white"
              style={{
                transition: "transform 0.25s var(--ease-spring)",
                transform: contextActive ? "translateX(20px)" : "translateX(2px)",
              }}
            />
          </button>
        </div>

        {/* Section label */}
        <span className="mono text-[9px] text-wallet-muted/60 uppercase tracking-[0.15em] px-1 mt-2">
          Browser Extension
        </span>

        {/* Bridge status + token — glass card */}
        <div className="cc-shell px-3.5 py-3 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-wallet-white">Local bridge</span>
            <span
              className="mono text-[10px] uppercase tracking-[0.14em]"
              style={{ color: bridge ? "var(--color-wallet-green)" : "var(--color-wallet-muted)" }}
            >
              {bridge ? `● 127.0.0.1:${bridge.port}` : "○ off"}
            </span>
          </div>
          <p className="text-[11px] text-wallet-muted leading-relaxed">
            The Wallet browser extension pairs with this device using a one-time token. The bridge
            only accepts requests from your own machine.
          </p>

          {bridge && (
            <div className="mt-1 flex items-center gap-2">
              <code
                className="mono text-[10px] flex-1 min-w-0 truncate px-2 py-1.5 rounded-md bg-black/20 text-wallet-white select-all"
                title="Pairing token"
              >
                {revealed ? bridge.token : maskedToken}
              </code>
              <button
                onClick={() => setRevealed((v) => !v)}
                className="text-[10px] mono uppercase tracking-[0.1em] text-wallet-muted hover:text-wallet-white transition-colors"
              >
                {revealed ? "hide" : "show"}
              </button>
              <button
                onClick={copyToken}
                className="text-[10px] mono uppercase tracking-[0.1em] text-wallet-white hover:opacity-80 transition-opacity"
              >
                {copied ? "copied" : "copy"}
              </button>
            </div>
          )}
        </div>

        {/* Section label */}
        <span className="mono text-[9px] text-wallet-muted/60 uppercase tracking-[0.15em] px-1 mt-2">
          General
        </span>

        {/* About — glass card */}
        <div className="cc-shell px-3.5 py-3">
          <span className="text-[13px] text-wallet-white">About</span>
          <p className="text-[11px] text-wallet-muted mt-0.5">
            Wallet v1.0.3 — Personal AI context layer
          </p>
        </div>

        {/* Quit — glass card */}
        <button
          onClick={() => window.wallet.quitApp()}
          className="cc-shell px-3.5 py-3 text-left w-full transition-colors duration-200 hover:bg-red-500/[0.06]"
        >
          <span className="text-[13px] text-red-400">
            Quit Wallet
          </span>
        </button>
      </div>
    </div>
  );
}
