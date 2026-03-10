import { app, BrowserWindow, Tray, ipcMain, clipboard, screen, Menu } from "electron";
import path from "path";
import Store from "electron-store";
import { startContextEngine } from "./context";
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
    cards: createMockCards(),
    onboardingComplete: false,
  },
}) as Store<StoreSchema> & {
  get<K extends keyof StoreSchema>(key: K): StoreSchema[K];
  set<K extends keyof StoreSchema>(key: K, value: StoreSchema[K]): void;
};

function createMockCards(): WalletCard[] {
  const now = new Date().toISOString();
  const mocks: Record<CardID, { content: string; summary: string }> = {
    identity: {
      content:
        "Ryan Rosenthal — UI/UX designer and product builder. 10+ years shipping consumer and B2B products. I build tools that make creative work faster and AI more useful for non-technical people.",
      summary: "Product builder, 10yr UI/UX, AI tools",
    },
    voice: {
      content:
        "Direct and concise. No filler words. Lowercase when casual. Dashes over semicolons. Conviction-based — no hedging. Never say: game-changer, ecosystem, synergy, let me break it down. Contrarian but calm.",
      summary: "Direct, lowercase, no filler, contrarian",
    },
    expertise: {
      content:
        "UI/UX design, brand strategy, product architecture. UCLA psychology background. Deep in SwiftUI, Next.js, Tailwind, Supabase. Strong POV: AI tools should be opinionated, not blank canvases.",
      summary: "Design, brand, product, SwiftUI, Next.js",
    },
    currentWork: {
      content:
        "Building Wallet — a personal AI context layer for macOS. Also shipping r0am.io (startup validation marketplace) and Brand Better (AI creative suite). Solo founder, all three products.",
      summary: "Wallet, r0am.io, Brand Better — solo",
    },
    audience: {
      content:
        "Creators, solo founders, brand builders, vibe coders. People who use AI daily but waste time re-explaining themselves. They want tools that just know them. Fear: being generic. Desire: feeling understood.",
      summary: "Creators, founders, vibe coders",
    },
    aesthetic: {
      content:
        "Dark mode, glass surfaces, purple-cyan gradients. Brutalist accents with editorial typography. References: Linear, Arc Browser, Teenage Engineering. Generous whitespace. No AI slop.",
      summary: "Dark, glass, brutalist, editorial",
    },
    narrative: {
      content:
        "Had 100+ startup ideas, never shipped — not because I couldn't build, but because I was paralyzed by knowing too many failure patterns. Built r0am to solve that for others. Now building the AI identity layer because every tool asks who you are and nobody should answer that twice.",
      summary: "Paralyzed by patterns → built the fix",
    },
    goals: {
      content:
        "Ship Wallet beta to 50 users by end of March. Prove that personal context injection makes AI tools 10x more useful without any extra effort from the user.",
      summary: "Wallet beta → 50 users by March",
    },
  };

  return (Object.keys(CARD_META) as CardID[]).map((id) => ({
    id,
    name: CARD_META[id].name,
    icon: CARD_META[id].icon,
    content: mocks[id].content,
    summary: mocks[id].summary,
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
  if (!win) {
    createWindow();
  }

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

app.whenReady().then(() => {
  // Hide dock icon
  app.dock?.hide();

  // Create tray — use a template image text for now
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

  // Pre-create window
  createWindow();

  console.log("Wallet is ready");

  // Start watching for app changes
  startContextEngine((detectedApp: DetectedApp) => {
    const cards = store.get("cards");
    const relevantIds = APP_CARD_MAP[detectedApp] || ["identity"];
    const relevantCards = cards.filter(
      (c) => relevantIds.includes(c.id) && c.content.trim().length > 0
    );

    if (relevantCards.length > 0) {
      const formatted = formatCards(relevantCards);
      clipboard.writeText(formatted);

      const now = new Date().toISOString();
      const updated = cards.map((c) =>
        relevantIds.includes(c.id)
          ? { ...c, isActive: true, lastInjected: now }
          : c
      );
      store.set("cards", updated);

      win?.webContents.send("injection", {
        cardIds: relevantIds,
        app: detectedApp,
        timestamp: now,
      });

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
  });

  // Sync cards to MCP bridge file
  syncCardsForMCP(store.get("cards"));
});

function createTrayIcon(): Electron.NativeImage {
  const { nativeImage } = require("electron");
  const iconPath = path.join(__dirname, "../../assets/trayIconTemplate.png");
  const img = nativeImage.createFromPath(iconPath);
  img.setTemplateImage(true);
  return img;
}

// IPC handlers
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
  if (!card) return;

  const formatted = formatCards([card]);
  clipboard.writeText(formatted);

  const now = new Date().toISOString();
  const updated = cards.map((c) =>
    c.id === cardId ? { ...c, isActive: true, lastInjected: now } : c
  );
  store.set("cards", updated);
  syncCardsForMCP(updated);

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
  const cards = store.get("cards");
  const detectedApp = (appName || "unknown") as DetectedApp;
  const relevantIds = APP_CARD_MAP[detectedApp] || ["identity"];
  const relevant = cards.filter(
    (c) => relevantIds.includes(c.id) && c.content.trim().length > 0
  );

  if (relevant.length === 0) return cards;

  const formatted = formatCards(relevant);
  clipboard.writeText(formatted);

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

  return updated;
});

ipcMain.handle("get-onboarding-complete", () =>
  store.get("onboardingComplete")
);

ipcMain.handle("set-onboarding-complete", () => {
  store.set("onboardingComplete", true);
  return true;
});

app.on("window-all-closed", () => {
  // Keep running in tray — do nothing
});
