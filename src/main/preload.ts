import { contextBridge, ipcRenderer } from "electron";
import type { WalletCard, CardID, InjectionEvent } from "./types";

contextBridge.exposeInMainWorld("wallet", {
  getCards: (): Promise<WalletCard[]> => ipcRenderer.invoke("get-cards"),
  updateCard: (card: WalletCard): Promise<WalletCard[]> =>
    ipcRenderer.invoke("update-card", card),
  injectCard: (cardId: CardID): Promise<WalletCard[]> =>
    ipcRenderer.invoke("inject-card", cardId),
  injectAllRelevant: (app: string): Promise<WalletCard[]> =>
    ipcRenderer.invoke("inject-all-relevant", app),
  getOnboardingComplete: (): Promise<boolean> =>
    ipcRenderer.invoke("get-onboarding-complete"),
  setOnboardingComplete: (): Promise<boolean> =>
    ipcRenderer.invoke("set-onboarding-complete"),

  // Event listeners
  onInjection: (cb: (data: InjectionEvent) => void) => {
    ipcRenderer.on("injection", (_e, data) => cb(data));
    return () => ipcRenderer.removeAllListeners("injection");
  },
  onCardsUpdated: (cb: (cards: WalletCard[]) => void) => {
    ipcRenderer.on("cards-updated", (_e, cards) => cb(cards));
    return () => ipcRenderer.removeAllListeners("cards-updated");
  },
  onTrayState: (cb: (state: string) => void) => {
    ipcRenderer.on("tray-state", (_e, state) => cb(state));
    return () => ipcRenderer.removeAllListeners("tray-state");
  },
});
