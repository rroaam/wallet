// Wallet extension — service worker.
// Proxies requests from content scripts to the local Wallet bridge,
// so the token never lives in the DOM of third-party AI sites.

const BRIDGE_URL = "http://127.0.0.1:9847";

async function getToken() {
  const { walletToken } = await chrome.storage.local.get("walletToken");
  return walletToken || null;
}

async function callBridge(path, init = {}) {
  const token = await getToken();
  if (!token) {
    return { ok: false, error: "not_paired" };
  }
  try {
    const res = await fetch(`${BRIDGE_URL}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...(init.headers || {}),
      },
    });
    if (res.status === 401) return { ok: false, error: "unauthorized" };
    if (!res.ok) return { ok: false, error: `http_${res.status}` };
    const body = await res.json().catch(() => null);
    return { ok: true, data: body };
  } catch (err) {
    return { ok: false, error: "bridge_offline" };
  }
}

async function healthCheck() {
  try {
    const res = await fetch(`${BRIDGE_URL}/health`);
    if (!res.ok) return false;
    const body = await res.json();
    return body?.ok === true;
  } catch {
    return false;
  }
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  (async () => {
    if (msg?.type === "ping") {
      const alive = await healthCheck();
      sendResponse({ ok: alive });
      return;
    }
    if (msg?.type === "get-context") {
      const host = encodeURIComponent(msg.host || "");
      const result = await callBridge(`/context?host=${host}`);
      sendResponse(result);
      return;
    }
    if (msg?.type === "get-cards") {
      const result = await callBridge("/cards");
      sendResponse(result);
      return;
    }
    if (msg?.type === "set-token") {
      const token = String(msg.token || "").trim();
      if (!token) {
        sendResponse({ ok: false, error: "empty" });
        return;
      }
      await chrome.storage.local.set({ walletToken: token });
      const res = await fetch(`${BRIDGE_URL}/cards`, {
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => null);
      if (!res || res.status === 401) {
        sendResponse({ ok: false, error: "invalid_token" });
        return;
      }
      if (!res.ok) {
        sendResponse({ ok: false, error: `http_${res.status}` });
        return;
      }
      sendResponse({ ok: true });
      return;
    }
    if (msg?.type === "clear-token") {
      await chrome.storage.local.remove("walletToken");
      sendResponse({ ok: true });
      return;
    }
    sendResponse({ ok: false, error: "unknown_message" });
  })();
  return true; // async response
});
