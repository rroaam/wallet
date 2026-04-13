// Wallet content script.
//
// Finds the active composer/textarea on supported AI sites, draws a small
// floating Wallet button, and on click pulls relevant context cards from
// the local bridge (via the background service worker) and inserts them
// at the top of the composer.

(function () {
  if (window.__walletInjected) return;
  window.__walletInjected = true;

  const HOST = location.hostname;

  // Find the composer input on the current page.
  function findComposer() {
    // Claude — contenteditable ProseMirror
    let el = document.querySelector('div[contenteditable="true"].ProseMirror');
    if (el) return { el, kind: "contenteditable" };

    // ChatGPT — contenteditable #prompt-textarea or textarea
    el =
      document.querySelector("#prompt-textarea") ||
      document.querySelector('div[contenteditable="true"][data-testid*="prompt"]');
    if (el) {
      return {
        el,
        kind: el.tagName === "TEXTAREA" ? "textarea" : "contenteditable",
      };
    }

    // Gemini — rich-textarea with contenteditable
    el = document.querySelector('rich-textarea [contenteditable="true"]');
    if (el) return { el, kind: "contenteditable" };

    // Perplexity — textarea
    el = document.querySelector('textarea[placeholder*="Ask"]') ||
      document.querySelector('textarea');
    if (el) return { el, kind: "textarea" };

    // Copilot — textarea or contenteditable
    el = document.querySelector('textarea#userInput') ||
      document.querySelector('div[contenteditable="true"][role="textbox"]');
    if (el) {
      return {
        el,
        kind: el.tagName === "TEXTAREA" ? "textarea" : "contenteditable",
      };
    }

    // Generic fallback
    el =
      document.querySelector('textarea') ||
      document.querySelector('div[contenteditable="true"][role="textbox"]');
    if (el) {
      return {
        el,
        kind: el.tagName === "TEXTAREA" ? "textarea" : "contenteditable",
      };
    }

    return null;
  }

  function setNativeValue(el, value) {
    const setter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      "value",
    )?.set;
    setter?.call(el, value);
    el.dispatchEvent(new Event("input", { bubbles: true }));
  }

  function insertIntoComposer(kind, el, text) {
    el.focus();
    if (kind === "textarea") {
      const existing = el.value || "";
      setNativeValue(el, `${text}\n\n${existing}`);
      // Move cursor to end
      el.selectionStart = el.selectionEnd = el.value.length;
      return;
    }
    // contenteditable
    const target = el;
    const block = document.createElement("div");
    block.innerText = text;
    // Insert at top
    if (target.firstChild) {
      target.insertBefore(document.createElement("br"), target.firstChild);
      target.insertBefore(block, target.firstChild);
    } else {
      target.appendChild(block);
    }
    target.dispatchEvent(new InputEvent("input", { bubbles: true }));
  }

  function send(type, payload) {
    return new Promise((resolve) => {
      try {
        chrome.runtime.sendMessage({ type, ...payload }, (response) => {
          if (chrome.runtime.lastError) {
            resolve({ ok: false, error: "runtime" });
          } else {
            resolve(response);
          }
        });
      } catch {
        resolve({ ok: false, error: "send_failed" });
      }
    });
  }

  // ── UI ────────────────────────────────────────────────────────────
  let root = null;
  let button = null;
  let toast = null;

  function ensureUI() {
    if (root) return root;

    root = document.createElement("div");
    root.id = "wallet-injector-root";

    button = document.createElement("button");
    button.id = "wallet-injector-button";
    button.type = "button";
    button.innerHTML = `
      <span id="wallet-injector-dot"></span>
      <span id="wallet-injector-label">Wallet</span>
      <span id="wallet-injector-hint">⌘ inject</span>
    `;

    toast = document.createElement("div");
    toast.id = "wallet-injector-toast";
    toast.setAttribute("data-visible", "false");

    root.appendChild(toast);
    root.appendChild(button);
    document.documentElement.appendChild(root);

    button.addEventListener("click", onInject);

    return root;
  }

  function showToast(text, duration = 2000) {
    if (!toast) return;
    toast.textContent = text;
    toast.setAttribute("data-visible", "true");
    setTimeout(() => toast.setAttribute("data-visible", "false"), duration);
  }

  async function onInject() {
    const composer = findComposer();
    if (!composer) {
      showToast("No composer found on this page");
      return;
    }

    button.setAttribute("data-state", "injecting");
    const label = button.querySelector("#wallet-injector-label");
    const hint = button.querySelector("#wallet-injector-hint");
    const priorLabel = label.textContent;
    label.textContent = "Fetching context…";
    hint.style.display = "none";

    const response = await send("get-context", { host: HOST });
    if (!response?.ok) {
      const reason = response?.error || "unknown";
      if (reason === "not_paired" || reason === "unauthorized") {
        showToast("Open the extension popup to pair with Wallet");
      } else if (reason === "bridge_offline") {
        showToast("Wallet app is not running");
      } else {
        showToast(`Error: ${reason}`);
      }
      label.textContent = priorLabel;
      hint.style.display = "";
      button.removeAttribute("data-state");
      return;
    }

    const text = response.data?.text || "";
    if (!text.trim()) {
      showToast("No matching cards filled yet");
      label.textContent = priorLabel;
      hint.style.display = "";
      button.removeAttribute("data-state");
      return;
    }

    insertIntoComposer(composer.kind, composer.el, text);

    const count = response.data?.cardIds?.length || 0;
    button.setAttribute("data-state", "success");
    label.textContent = `Injected ${count} card${count === 1 ? "" : "s"}`;
    setTimeout(() => {
      button.removeAttribute("data-state");
      label.textContent = priorLabel;
      hint.style.display = "";
    }, 1800);
  }

  // ⌘J to inject
  document.addEventListener(
    "keydown",
    (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "j") {
        e.preventDefault();
        onInject();
      }
    },
    true,
  );

  // Ensure UI appears once the page has a composer; retry briefly since
  // many AI apps hydrate their chat UI asynchronously.
  let attempts = 0;
  const maxAttempts = 30;
  const interval = setInterval(() => {
    attempts++;
    if (findComposer()) {
      ensureUI();
      clearInterval(interval);
      return;
    }
    if (attempts >= maxAttempts) {
      ensureUI(); // draw the button anyway so user sees the entry point
      clearInterval(interval);
    }
  }, 500);

  // Re-check pairing status on first click via health check
  ensureUI();
})();
