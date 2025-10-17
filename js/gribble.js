const BACKEND_URL = "http://82.21.151.228:24677"; // or public IP after port forwarding

// Elements
const inputBox = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const chatBox = document.getElementById("chat-box");
const statusIndicator = document.getElementById("gribble-status");

// Check if Gribble is online
async function checkStatus() {
  try {
    const res = await fetch(`${BACKEND_URL}/status`);
    const data = await res.json();
    statusIndicator.textContent = data.online ? "Gribble is Online 🟢" : "Gribble is Offline 🔴";
  } catch {
    statusIndicator.textContent = "Gribble is Offline 🔴";
  }
}

// Send message to Gribble
async function sendMessage() {
  const userText = inputBox.value.trim();
  if (!userText) return;

  // Show user message
  chatBox.innerHTML += `<div class="user-msg">You: ${userText}</div>`;
  inputBox.value = "";

  try {
    const res = await fetch(`${BACKEND_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userText })
    });

    const data = await res.json();
    chatBox.innerHTML += `<div class="gribble-msg">Gribble: ${data.reply}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
  } catch {
    chatBox.innerHTML += `<div class="gribble-msg">Gribble: ❌ Could not reach server</div>`;
  }
}

// Event listeners
sendBtn.addEventListener("click", sendMessage);
inputBox.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

// Check status every 5 seconds
checkStatus();
setInterval(checkStatus, 5000);
