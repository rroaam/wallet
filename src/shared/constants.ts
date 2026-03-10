import type { CardID, DetectedApp } from "./types";

export const CARD_META: Record<
  CardID,
  {
    name: string;
    icon: string;
    tag: string;
    prompt: string;
    surfacesWhen: string;
  }
> = {
  identity: {
    name: "Identity",
    icon: "user",
    tag: "ID",
    prompt:
      "Who are you? Name, role, elevator pitch, how you want to be perceived.",
    surfacesWhen: "New conversation, cold context",
  },
  voice: {
    name: "Voice",
    icon: "audio-waveform",
    tag: "VO",
    prompt:
      "How do you sound? Cadence, vocabulary, adjectives you use, what to never say.",
    surfacesWhen: "Writing emails, posts, docs",
  },
  expertise: {
    name: "Expertise",
    icon: "brain",
    tag: "EX",
    prompt:
      "What do you know deeply? Credentials, strong POVs, knowledge areas.",
    surfacesWhen: "Answering questions, thought leadership",
  },
  currentWork: {
    name: "Current Work",
    icon: "hammer",
    tag: "CW",
    prompt:
      "What are you working on right now? Active projects, sprint focus, recent decisions.",
    surfacesWhen: "Notion, Linear, project tools",
  },
  audience: {
    name: "Audience",
    icon: "users",
    tag: "AU",
    prompt:
      "Who do you talk to? Their fears, motivations, why they care about your work.",
    surfacesWhen: "Writing copy, pitches, emails",
  },
  aesthetic: {
    name: "Aesthetic",
    icon: "palette",
    tag: "AE",
    prompt:
      "What feels right visually? Design principles, references, visual identity.",
    surfacesWhen: "Figma, Canva, design tools",
  },
  narrative: {
    name: "Narrative",
    icon: "book-open",
    tag: "NA",
    prompt:
      "What's your story? Origin, company thesis, why you, why now.",
    surfacesWhen: "Investor emails, LinkedIn, pitches",
  },
  goals: {
    name: "Goals",
    icon: "flag",
    tag: "GO",
    prompt:
      "What's the north star this quarter? One sentence, not OKRs.",
    surfacesWhen: "Planning, strategy, prioritization",
  },
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

export const MAX_CONTENT_LENGTH = 2000;
export const MAX_SUMMARY_LENGTH = 80;
