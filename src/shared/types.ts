export type CardID =
  | "identity"
  | "voice"
  | "expertise"
  | "currentWork"
  | "audience"
  | "aesthetic"
  | "narrative"
  | "goals";

export const ALL_CARD_IDS: CardID[] = [
  "identity",
  "voice",
  "expertise",
  "currentWork",
  "audience",
  "aesthetic",
  "narrative",
  "goals",
];

export interface WalletCard {
  id: CardID;
  name: string;
  icon: string;
  content: string;
  summary: string;
  isActive: boolean;
  lastInjected: string | null;
  updatedAt: string;
}

export type DetectedApp =
  | "claude"
  | "chatgpt"
  | "notion"
  | "figma"
  | "linear"
  | "mail"
  | "outlook"
  | "superhuman"
  | "cursor"
  | "xcode"
  | "vscode"
  | "unknown";

export type WalletState = "idle" | "injecting" | "trayOpen";

export interface InjectionEvent {
  cardIds: CardID[];
  app: DetectedApp;
  timestamp: string;
}
