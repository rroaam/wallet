// Re-export shared types for CommonJS main process
export type CardID =
  | "identity"
  | "voice"
  | "expertise"
  | "currentWork"
  | "audience"
  | "aesthetic"
  | "narrative"
  | "goals";

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
