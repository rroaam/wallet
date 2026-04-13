const statusEl = document.getElementById("status");
const statusLabel = statusEl.querySelector(".label");
const pairForm = document.getElementById("pair-form");
const pairedView = document.getElementById("paired-view");
const tokenInput = document.getElementById("token-input");
const pairBtn = document.getElementById("pair-btn");
const unpairBtn = document.getElementById("unpair-btn");
const errorEl = document.getElementById("pair-error");

function setStatus(state, label) {
  statusEl.setAttribute("data-state", state);
  statusLabel.textContent = label;
}

function showError(msg) {
  errorEl.textContent = msg;
  errorEl.hidden = false;
}
function clearError() {
  errorEl.hidden = true;
  errorEl.textContent = "";
}

function showPaired() {
  pairForm.hidden = true;
  pairedView.hidden = false;
}
function showPairForm() {
  pairForm.hidden = false;
  pairedView.hidden = true;
  tokenInput.value = "";
}

function send(msg) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(msg, (response) => {
      if (chrome.runtime.lastError) {
        resolve({ ok: false, error: "runtime" });
      } else {
        resolve(response);
      }
    });
  });
}

async function init() {
  const { walletToken } = await chrome.storage.local.get("walletToken");
  const ping = await send({ type: "ping" });

  if (!ping?.ok) {
    setStatus("offline", "App off");
    if (walletToken) {
      showPaired();
    } else {
      showPairForm();
    }
    return;
  }

  setStatus("online", "Connected");

  if (walletToken) {
    // Validate existing token
    const res = await send({ type: "get-cards" });
    if (res?.ok) {
      showPaired();
    } else {
      showPairForm();
    }
  } else {
    showPairForm();
  }
}

pairBtn.addEventListener("click", async () => {
  clearError();
  const token = tokenInput.value.trim();
  if (!token) {
    showError("Token is required");
    return;
  }
  pairBtn.disabled = true;
  pairBtn.textContent = "Pairing…";

  const res = await send({ type: "set-token", token });

  pairBtn.disabled = false;
  pairBtn.textContent = "Pair device";

  if (!res?.ok) {
    const map = {
      empty: "Token is empty",
      invalid_token: "Token rejected by Wallet",
      bridge_offline: "Wallet app is not running",
      not_paired: "Pairing failed",
    };
    showError(map[res?.error] || `Error: ${res?.error || "unknown"}`);
    return;
  }

  setStatus("online", "Connected");
  showPaired();
});

unpairBtn.addEventListener("click", async () => {
  await send({ type: "clear-token" });
  showPairForm();
});

tokenInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") pairBtn.click();
});

init();
