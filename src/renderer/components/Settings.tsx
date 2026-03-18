interface SettingsProps {
  onBack: () => void;
  contextActive: boolean;
  onToggleContext: () => void;
}

export function Settings({ onBack, contextActive, onToggleContext }: SettingsProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 h-11 shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-wallet-muted hover:text-wallet-white transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          <span className="text-[13px]">Back</span>
        </button>

        <span className="text-[13px] font-semibold text-wallet-white">
          Settings
        </span>

        <div className="w-10" />
      </div>

      <div className="h-px bg-wallet-border" />

      {/* Settings list */}
      <div className="flex-1 overflow-y-auto px-3.5 py-3 flex flex-col gap-2">
        {/* Section label */}
        <span className="mono text-[9px] text-wallet-muted/60 uppercase tracking-[0.15em] px-1">
          Engine
        </span>

        {/* Context Engine toggle — glass card */}
        <div className="glass rounded-xl px-3.5 py-3 flex items-center justify-between">
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
          General
        </span>

        {/* About — glass card */}
        <div className="glass rounded-xl px-3.5 py-3">
          <span className="text-[13px] text-wallet-white">About</span>
          <p className="text-[11px] text-wallet-muted mt-0.5">
            Wallet v1.0.0 — Personal AI context layer
          </p>
        </div>

        {/* Quit — glass card */}
        <button
          onClick={() => window.wallet.quitApp()}
          className="glass rounded-xl px-3.5 py-3 text-left w-full transition-colors duration-200 hover:bg-red-500/[0.06]"
        >
          <span className="text-[13px] text-red-400">
            Quit Wallet
          </span>
        </button>
      </div>
    </div>
  );
}
