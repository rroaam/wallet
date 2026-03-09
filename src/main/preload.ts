import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("wallet", {
  getCards: () => ipcRenderer.invoke("get-cards"),
  updateCard: (card: any) => ipcRenderer.invoke("update-card", card),
  injectCard: (cardId: string) => ipcRenderer.invoke("inject-card", cardId),
  injectAllRelevant: (app: string) =>
    ipcRenderer.invoke("inject-all-relevant", app),
  getOnboardingComplete: () => ipcRenderer.invoke("get-onboarding-complete"),
  setOnboardingComplete: () => ipcRenderer.invoke("set-onboarding-complete"),

  // Event listeners
  onInjection: (cb: (data: any) => void) => {
    ipcRenderer.on("injection", (_e, data) => cb(data));
    return () => ipcRenderer.removeAllListeners("injection");
  },
  onCardsUpdated: (cb: (cards: any[]) => void) => {
    ipcRenderer.on("cards-updated", (_e, cards) => cb(cards));
    return () => ipcRenderer.removeAllListeners("cards-updated");
  },
  onTrayState: (cb: (state: string) => void) => {
    ipcRenderer.on("tray-state", (_e, state) => cb(state));
    return () => ipcRenderer.removeAllListeners("tray-state");
  },
});
