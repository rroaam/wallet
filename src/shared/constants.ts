import type { CardID, DetectedApp } from "./types";

export const CARD_ACCENT_COLORS: Record<CardID, string> = {
  identity: "#7B61FF",
  voice: "#00D9E8",
  expertise: "#F59E0B",
  currentWork: "#10B981",
  audience: "#EC4899",
  aesthetic: "#8B5CF6",
  narrative: "#F97316",
  goals: "#06B6D4",
};

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

export const CARD_EXAMPLES: Record<CardID, string> = {
  identity:
    "Jane Smith — product designer and startup founder. 8 years building consumer apps. I care about craft, speed, and making complex tools feel simple. People describe me as direct, opinionated, and good at distilling ambiguity.",
  voice:
    "Concise and direct. Short sentences. No corporate speak. I use dashes and fragments. Lowercase when casual. Never say: leverage, synergy, deep dive, unpack, let's go. Warm but never sycophantic.",
  expertise:
    "Product design, brand strategy, and front-end development. Strong opinions on information architecture and design systems. Background in cognitive psychology. Deep in Figma, React, and Tailwind.",
  currentWork:
    "Building a personal AI context tool for macOS. Also advising two early-stage startups on product strategy. Current sprint: onboarding flow and MCP integration.",
  audience:
    "Creators and solo founders who use AI tools daily. They're frustrated by re-explaining themselves to every new chat. They want to feel understood, not generic. Fear: blending in. Desire: being seen as uniquely competent.",
  aesthetic:
    "Dark mode, glass surfaces, subtle gradients. Brutalist accents with generous whitespace. References: Linear, Arc Browser, Teenage Engineering. Typography-first. No rounded-everything, no AI slop.",
  narrative:
    "Spent years with great ideas but never shipped — not from inability, but from knowing too many failure patterns. Built tools to break that paralysis for others. Now building the identity layer for the AI era.",
  goals:
    "Ship beta to 50 users by end of month. Validate that personal context injection makes AI tools measurably more useful without extra effort from the user.",
};
