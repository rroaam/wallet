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
      <div className="flex-1 overflow-y-auto px-3.5 py-3">
        {/* Context Engine toggle */}
        <div className="flex items-center justify-between py-3">
          <div>
            <span className="text-[13px] text-wallet-white">Context Engine</span>
            <p className="text-[11px] text-wallet-muted mt-0.5">
              Auto-inject cards on app switch
            </p>
          </div>
          <button
            onClick={onToggleContext}
            className={`
              relative w-10 h-[22px] rounded-full transition-colors duration-200
              ${contextActive ? "bg-wallet-green" : "bg-wallet-surface border border-wallet-border"}
            `}
          >
            <div
              className={`
                absolute top-[2px] w-[18px] h-[18px] rounded-full bg-white transition-transform duration-200
                ${contextActive ? "translate-x-[20px]" : "translate-x-[2px]"}
              `}
            />
          </button>
        </div>

        <div className="h-px bg-wallet-border" />

        {/* About */}
        <div className="py-3">
          <span className="text-[13px] text-wallet-white">About</span>
          <p className="text-[11px] text-wallet-muted mt-0.5">
            Wallet v1.0.0 — Personal AI context layer
          </p>
        </div>

        <div className="h-px bg-wallet-border" />

        {/* Quit */}
        <button
          onClick={() => window.wallet.quitApp()}
          className="w-full py-3 text-left"
        >
          <span className="text-[13px] text-red-400 hover:text-red-300 transition-colors">
            Quit Wallet
          </span>
        </button>
      </div>
    </div>
  );
}
