const API_URL = "http://localhost:3000";

// Selectors
const messageFeed = document.getElementById("message-feed");
const logFeed = document.getElementById("log-feed");
const promptInput = document.getElementById("prompt-input");
const sendBtn = document.getElementById("send-btn");
const confidentialToggle = document.getElementById("confidential-mode");
const privacyShield = document.getElementById("confidential-indicator");
const statMarket = document.getElementById("stat-market");

// State
let isProcessing = false;

let lastLogTimestamp = 0;

/**
 * Add a message to the chat feed
 */
function addMessage(text, role = "agent") {
    const msgDiv = document.createElement("div");
    msgDiv.className = `message ${role}`;
    msgDiv.innerText = text;
    messageFeed.appendChild(msgDiv);
    messageFeed.scrollTop = messageFeed.scrollHeight;
}

/**
 * Add a log entry to the terminal
 */
function addLog(text, type = "system") {
    const logDiv = document.createElement("div");
    logDiv.className = `log-entry ${type}`;
    const timestamp = new Date().toLocaleTimeString([], { hour12: false });
    logDiv.innerText = `${timestamp} [${type.toUpperCase()}] ${text}`;
    logFeed.appendChild(logDiv);
    logFeed.scrollTop = logFeed.scrollHeight;
}

/**
 * Poll for logs from the agent
 */
async function pollLogs() {
    try {
        const response = await fetch(`${API_URL}/api/logs`);
        const logs = await response.json();
        
        logs.forEach(log => {
            if (log.timestamp > lastLogTimestamp) {
                addLog(log.text, log.type);
                lastLogTimestamp = log.timestamp;
            }
        });
    } catch (e) {
        console.error("Log polling error:", e);
    }
}

/**
 * Send message to the agent API
 */
async function sendMessage() {
    const text = promptInput.value.trim();
    if (!text || isProcessing) return;

    isProcessing = true;
    sendBtn.innerText = "Igniting...";
    sendBtn.disabled = true;

    // UI Updates
    addMessage(text, "user");
    promptInput.value = "";

    // Call Backend (Execution Trigger)
    try {
        const response = await fetch(`${API_URL}/api/execution/trigger`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                amount: "1.0",
                sourceChain: "Solana",
                targetChain: "Base",
                text 
            })
        });

        const data = await response.json();
        if (data.success) {
            addMessage(data.agentFeedback, "agent");
        }
    } catch (error) {
        console.error("API Error:", error);
        addMessage("Transmission failure. Check agent connectivity.", "agent");
    } finally {
        isProcessing = false;
        sendBtn.innerText = "Ignite Forge";
        sendBtn.disabled = false;
    }
}

/**
 * Polling for Agent Status
 */
async function updateStatus() {
    try {
        const response = await fetch(`${API_URL}/api/status`);
        const data = await response.json();
        statMarket.innerText = `${data.currentMarket.substring(0, 8)}...`;
    } catch (e) {
        statMarket.innerText = "Offline";
    }
}

// Event Listeners
sendBtn.addEventListener("click", sendMessage);
promptInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Initial Setup
updateStatus();
setInterval(updateStatus, 5000);
setInterval(pollLogs, 1000);

addLog("Hyper-Intelligence Link: ONLINE", "system");
addLog("Cortex GPU Forge: STANDBY", "system");
