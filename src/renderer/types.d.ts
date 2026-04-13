import type { WalletCard, CardID, InjectionEvent } from "@shared/types";

declare global {
  interface Window {
    wallet: {
      getCards: () => Promise<WalletCard[]>;
      updateCard: (card: WalletCard) => Promise<WalletCard[]>;
      injectCard: (cardId: CardID) => Promise<WalletCard[]>;
      injectAllRelevant: (app: string) => Promise<WalletCard[]>;
      getOnboardingComplete: () => Promise<boolean>;
      setOnboardingComplete: () => Promise<boolean>;
      quitApp: () => Promise<void>;
      setContextActive: (active: boolean) => Promise<boolean>;
      getBridgeInfo: () => Promise<
        { port: number; token: string; url: string } | null
      >;
      onInjection: (cb: (data: InjectionEvent) => void) => () => void;
      onCardsUpdated: (cb: (cards: WalletCard[]) => void) => () => void;
      onTrayState: (cb: (state: string) => void) => () => void;
    };
  }
}

export {};
