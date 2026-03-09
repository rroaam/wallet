import type { CardID, DetectedApp } from "./types";

export const CARD_META: Record<
  CardID,
  { name: string; icon: string; tag: string }
> = {
  identity: { name: "Identity", icon: "user", tag: "ID" },
  voice: { name: "Voice", icon: "audio-waveform", tag: "VO" },
  expertise: { name: "Expertise", icon: "brain", tag: "EX" },
  currentWork: { name: "Current Work", icon: "hammer", tag: "CW" },
  audience: { name: "Audience", icon: "users", tag: "AU" },
  aesthetic: { name: "Aesthetic", icon: "palette", tag: "AE" },
  narrative: { name: "Narrative", icon: "book-open", tag: "NA" },
  goals: { name: "Goals", icon: "flag", tag: "GO" },
};

export const BUNDLE_TO_APP: Record<string, DetectedApp> = {
  "com.anthropic.claude": "claude",
  "com.anthropic.claudefordesktop": "claude",
  "com.openai.chat": "chatgpt",
  "notion.id": "notion",
  "com.figma.Desktop": "figma",
  "com.linear": "linear",
  "com.apple.mail": "mail",
  "com.microsoft.Outlook": "outlook",
  "com.superhuman.electron": "superhuman",
  "com.todesktop.230313mzl4w4u92": "cursor",
  "com.apple.dt.Xcode": "xcode",
  "com.microsoft.VSCode": "vscode",
};

export const APP_CARD_MAP: Record<DetectedApp, CardID[]> = {
  claude: ["voice", "identity", "narrative"],
  chatgpt: ["voice", "identity", "expertise"],
  notion: ["currentWork", "voice", "audience"],
  figma: ["aesthetic", "currentWork"],
  linear: ["currentWork", "goals"],
  mail: ["voice", "identity", "audience"],
  outlook: ["voice", "identity", "audience"],
  superhuman: ["voice", "identity", "audience"],
  cursor: ["currentWork", "expertise"],
  xcode: ["currentWork", "expertise"],
  vscode: ["currentWork", "expertise"],
  unknown: ["identity"],
};
