import { execSync } from "child_process";
import { BUNDLE_TO_APP } from "./constants";
import type { DetectedApp } from "./types";

let intervalId: ReturnType<typeof setInterval> | null = null;
let lastBundleId = "";

/**
 * Detects the currently active (frontmost) macOS application using osascript.
 * No Xcode or native dependencies required.
 */
function getActiveApp(): DetectedApp {
  try {
    const bundleId = execSync(
      `osascript -e 'tell application "System Events" to get bundle identifier of first process whose frontmost is true'`,
      { encoding: "utf-8", timeout: 2000 }
    ).trim();

    return BUNDLE_TO_APP[bundleId] || "unknown";
  } catch {
    return "unknown";
  }
}

/**
 * Start polling for active app changes.
 * Calls onAppChange only when the frontmost app actually changes.
 */
export function startContextEngine(
  onAppChange: (app: DetectedApp) => void
): void {
  // Poll every 2 seconds
  intervalId = setInterval(() => {
    try {
      const bundleId = execSync(
        `osascript -e 'tell application "System Events" to get bundle identifier of first process whose frontmost is true'`,
        { encoding: "utf-8", timeout: 2000 }
      ).trim();

      if (bundleId !== lastBundleId) {
        lastBundleId = bundleId;
        const app = BUNDLE_TO_APP[bundleId] || "unknown";

        // Don't inject when Wallet itself is frontmost or on unknown apps
        if (bundleId !== "com.designwithroam.wallet" && app !== "unknown") {
          onAppChange(app);
        }
      }
    } catch {
      // osascript timeout or error — skip this cycle
    }
  }, 2000);
}

export function stopContextEngine(): void {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}
