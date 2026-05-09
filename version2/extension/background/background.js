// background.js - Service worker for IntelliJob AI Copilot

console.log("IntelliJob AI Copilot Background Service Worker loaded.");

let authToken = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Received message in background:", request);
  
  if (request.action === "set_token") {
    authToken = request.token;
    chrome.storage.local.set({ token: authToken });
    sendResponse({ status: "token_saved" });
    return true;
  }
  
  if (request.action === "analyze_form") {
    sendResponse({ status: "processing", message: "Sending fields to AI agent..." });
    
    // Retrieve token from storage if not in memory
    chrome.storage.local.get(["token"]).then((result) => {
      const token = authToken || result.token;
      
      if (!token) {
        chrome.tabs.sendMessage(sender.tab.id, {
          action: "error",
          message: "Please log into the IntelliJob Dashboard first."
        });
        return;
      }
      
      // Call FastAPI backend
      fetch("http://localhost:8000/extension/autofill", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          fields: request.data,
          job_description: request.job_description || ""
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          chrome.tabs.sendMessage(sender.tab.id, {
            action: "fill_form",
            plan: data.plan
          });
        } else {
          throw new Error(data.detail || "Failed to generate plan");
        }
      })
      .catch(err => {
        console.error("Backend Error:", err);
        chrome.tabs.sendMessage(sender.tab.id, {
          action: "error",
          message: err.message
        });
      });
    });
    
    return true; // Keep message channel open for async response
  }
  
  return true;
});
