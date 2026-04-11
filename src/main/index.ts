import { app, BrowserWindow, Tray, ipcMain, clipboard, screen, Menu, globalShortcut } from "electron";
import path from "path";
import Store from "electron-store";
import { autoUpdater } from "electron-updater";
import { startContextEngine, stopContextEngine } from "./context";
import { formatCards } from "./injection";
import { WalletCard, CardID, DetectedApp } from "./types";
import { CARD_META, APP_CARD_MAP } from "./constants";
import { syncCardsForMCP } from "./mcp-bridge";

// Type re-exports for main process (CommonJS)
export type { WalletCard, CardID, DetectedApp };

// Persistence
interface StoreSchema {
  cards: WalletCard[];
  onboardingComplete: boolean;
}

const store = new Store<StoreSchema>({
  defaults: {
    cards: createDefaultCards(),
    onboardingComplete: false,
  },
}) as Store<StoreSchema> & {
  get<K extends keyof StoreSchema>(key: K): StoreSchema[K];
  set<K extends keyof StoreSchema>(key: K, value: StoreSchema[K]): void;
};

function createDefaultCards(): WalletCard[] {
  const now = new Date().toISOString();
  return (Object.keys(CARD_META) as CardID[]).map((id) => ({
    id,
    name: CARD_META[id].name,
    icon: CARD_META[id].icon,
    content: "",
    summary: "",
    isActive: false,
    lastInjected: null,
    updatedAt: now,
  }));
}

// Determine renderer URL
const isDev = process.env.NODE_ENV !== "production";
const rendererURL = isDev
  ? "http://localhost:5173"
  : `file://${path.join(__dirname, "../renderer/index.html")}`;

let tray: Tray | null = null;
let win: BrowserWindow | null = null;

// ── Shared injection logic ────────────────────────────────────────────

function injectForApp(detectedApp: DetectedApp) {
  const cards = store.get("cards");
  const relevantIds = APP_CARD_MAP[detectedApp] || ["identity"];
  const relevant = cards.filter(
    (c) => relevantIds.includes(c.id) && c.content.trim().length > 0
  );

  if (relevant.length === 0) return;

  clipboard.writeText(formatCards(relevant));

  const now = new Date().toISOString();
  const updated = cards.map((c) =>
    relevantIds.includes(c.id) && c.content.trim().length > 0
      ? { ...c, isActive: true, lastInjected: now }
      : c
  );
  store.set("cards", updated);
  syncCardsForMCP(updated);

  win?.webContents.send("injection", {
    cardIds: relevantIds,
    app: detectedApp,
    timestamp: now,
  });

  // Reset isActive after 3s
  setTimeout(() => {
    const current = store.get("cards");
    store.set(
      "cards",
      current.map((c) =>
        relevantIds.includes(c.id) ? { ...c, isActive: false } : c
      )
    );
    win?.webContents.send("cards-updated", store.get("cards"));
  }, 3000);
}

// ── Window management ─────────────────────────────────────────────────

function createWindow() {
  win = new BrowserWindow({
    width: 320,
    height: 520,
    show: false,
    frame: false,
    resizable: false,
    movable: false,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    skipTaskbar: true,
    backgroundColor: "#090A11",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.loadURL(rendererURL);

  win.on("blur", () => {
    win?.hide();
    win?.webContents.send("tray-state", "idle");
  });

  win.on("closed", () => {
    win = null;
  });
}

function toggleWindow() {
  if (!win) createWindow();

  if (win!.isVisible()) {
    win!.hide();
    win!.webContents.send("tray-state", "idle");
  } else {
    positionWindow();
    win!.show();
    win!.focus();
    win!.webContents.send("tray-state", "trayOpen");
  }
}

function positionWindow() {
  if (!tray || !win) return;
  const trayBounds = tray.getBounds();
  const winBounds = win.getBounds();
  const x = Math.round(trayBounds.x + trayBounds.width / 2 - winBounds.width / 2);
  const y = Math.round(trayBounds.y + trayBounds.height);
  win.setPosition(x, y, false);
}

function createTrayIcon(): Electron.NativeImage {
  const { nativeImage } = require("electron");
  const iconPath = path.join(__dirname, "../../assets/trayIconTemplate.png");
  const img = nativeImage.createFromPath(iconPath);
  img.setTemplateImage(true);
  return img;
}

// ── App lifecycle ─────────────────────────────────────────────────────

app.whenReady().then(() => {
  app.dock?.hide();

  tray = new Tray(createTrayIcon());
  tray.setToolTip("Wallet");
  tray.on("click", toggleWindow);
  tray.on("right-click", () => {
    const contextMenu = Menu.buildFromTemplate([
      { label: "Open Wallet", click: toggleWindow },
      { type: "separator" },
      { label: "Quit", click: () => app.quit() },
    ]);
    tray?.popUpContextMenu(contextMenu);
  });

  createWindow();

  // Global hotkey: Cmd+Shift+W to toggle
  globalShortcut.register("CommandOrControl+Shift+W", toggleWindow);

  console.log("Wallet is ready");

  // Start context engine
  startContextEngine(injectForApp);

  // Sync cards for MCP on startup
  syncCardsForMCP(store.get("cards"));

  // Auto-updates (checks GitHub Releases, downloads + installs on quit)
  if (!isDev) {
    autoUpdater.logger = console;
    autoUpdater.autoDownload = true;
    autoUpdater.autoInstallOnAppQuit = true;
    autoUpdater.checkForUpdatesAndNotify().catch((err) => {
      console.error("Update check failed:", err);
    });
    // Re-check every 4 hours
    setInterval(() => {
      autoUpdater.checkForUpdates().catch(() => {});
    }, 4 * 60 * 60 * 1000);
  }
});

app.on("window-all-closed", () => {
  // Keep running in tray
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});

// ── IPC handlers ──────────────────────────────────────────────────────

ipcMain.handle("get-cards", () => store.get("cards"));

ipcMain.handle("update-card", (_e, card: WalletCard) => {
  const cards = store.get("cards");
  const idx = cards.findIndex((c) => c.id === card.id);
  if (idx === -1) return cards;

  card.updatedAt = new Date().toISOString();
  cards[idx] = card;
  store.set("cards", cards);
  syncCardsForMCP(cards);
  return cards;
});

ipcMain.handle("inject-card", (_e, cardId: CardID) => {
  const cards = store.get("cards");
  const card = cards.find((c) => c.id === cardId);
  if (!card || card.content.trim().length === 0) return cards;

  clipboard.writeText(formatCards([card]));

  const now = new Date().toISOString();
  const updated = cards.map((c) =>
    c.id === cardId ? { ...c, isActive: true, lastInjected: now } : c
  );
  store.set("cards", updated);
  syncCardsForMCP(updated);

  win?.webContents.send("injection", {
    cardIds: [cardId],
    app: "unknown" as DetectedApp,
    timestamp: now,
  });

  setTimeout(() => {
    const current = store.get("cards");
    store.set(
      "cards",
      current.map((c) => (c.id === cardId ? { ...c, isActive: false } : c))
    );
    win?.webContents.send("cards-updated", store.get("cards"));
  }, 3000);

  return updated;
});

ipcMain.handle("inject-all-relevant", (_e, appName: string) => {
  const detectedApp = (appName || "unknown") as DetectedApp;
  injectForApp(detectedApp);
  return store.get("cards");
});

ipcMain.handle("get-onboarding-complete", () =>
  store.get("onboardingComplete")
);

ipcMain.handle("set-onboarding-complete", () => {
  store.set("onboardingComplete", true);
  return true;
});

ipcMain.handle("quit-app", () => {
  app.quit();
});

ipcMain.handle("set-context-active", (_e, active: boolean) => {
  if (active) {
    startContextEngine(injectForApp);
  } else {
    stopContextEngine();
  }
  return active;
});
