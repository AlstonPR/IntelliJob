document.addEventListener("DOMContentLoaded", () => {
  const scanBtn = document.getElementById("scan-btn");
  const dashboardBtn = document.getElementById("dashboard-btn");
  const statusDiv = document.getElementById("status");

  scanBtn.addEventListener("click", async () => {
    statusDiv.innerText = "Scanning page for job application form...";
    
    // Get current active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (tab) {
      chrome.tabs.sendMessage(tab.id, { action: "scan_page" }, (response) => {
        if (chrome.runtime.lastError) {
          statusDiv.innerText = "Error: Please refresh the page and try again.";
          console.error(chrome.runtime.lastError);
        } else {
          statusDiv.innerText = `Scanned successfully. Found ${response.count} fields. AI reasoning started...`;
        }
      });
    }
  });

  dashboardBtn.addEventListener("click", () => {
    // Open the frontend Next.js dashboard
    chrome.tabs.create({ url: "http://localhost:3000/dashboard" });
  });
});
