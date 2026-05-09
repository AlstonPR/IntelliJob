// content.js - Injected into web pages

console.log("IntelliJob AI Copilot Content Script Loaded.");

// Token grabbing logic from Dashboard
if (window.location.hostname === "localhost" && window.location.port === "3000") {
  setTimeout(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      chrome.runtime.sendMessage({ action: "set_token", token: token }, (response) => {
        console.log("Token sent to extension background:", response);
      });
    }
  }, 2000);
}

function extractFormFields() {
  const inputs = document.querySelectorAll("input, textarea, select");
  const fields = [];
  
  inputs.forEach((input, index) => {
    // Skip hidden, submit, button, and image inputs
    const type = input.getAttribute("type");
    if (["hidden", "submit", "button", "image", "file"].includes(type)) return;
    if (input.style.display === "none" || input.style.visibility === "hidden") return;

    // Assign a unique identifier to reliably target this element later
    const uniqueId = `ij-field-${index}`;
    input.setAttribute("data-intellijob-id", uniqueId);
    
    // Find closest label
    let labelText = "";
    if (input.id) {
      const label = document.querySelector(`label[for="${input.id}"]`);
      if (label) labelText = label.innerText;
    }
    if (!labelText && input.closest("label")) {
      labelText = input.closest("label").innerText;
    }
    
    // Nearby text for context (previous sibling or parent)
    const contextText = input.parentElement ? input.parentElement.innerText.substring(0, 50) : "";

    fields.push({
      identifier: uniqueId,
      tagName: input.tagName,
      type: type || "text",
      id: input.id || "",
      name: input.name || "",
      placeholder: input.placeholder || "",
      ariaLabel: input.getAttribute("aria-label") || "",
      labelText: labelText.trim(),
      context: contextText.trim()
    });
  });
  
  return fields;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "scan_page") {
    const fields = extractFormFields();
    
    // Attempt to scrape a job description if available
    const bodyText = document.body.innerText;
    const job_description = bodyText.substring(0, 3000); // Send first 3000 chars for context
    
    console.log("Extracted fields:", fields);
    
    chrome.runtime.sendMessage({ 
      action: "analyze_form", 
      data: fields,
      job_description: job_description
    }, (response) => {
      console.log("Background response:", response);
    });
    
    sendResponse({ status: "scanned", count: fields.length });
  } else if (request.action === "fill_form") {
    console.log("Received AI Plan to autofill:", request.plan);
    autofillForm(request.plan);
  } else if (request.action === "error") {
    alert("IntelliJob AI Error: " + request.message);
  }
});

function autofillForm(plan) {
  // Plan is a dictionary { "field_id_or_name": "Value to fill" }
  let filledCount = 0;
  
  Object.keys(plan).forEach(key => {
    const value = plan[key];
    // First try our unique data attribute, fallback to ID or Name just in case
    let element = document.querySelector(`[data-intellijob-id="${key}"]`) 
               || document.getElementById(key) 
               || document.querySelector(`[name="${key}"]`);
    
    if (element) {
      if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
        if (element.type === "checkbox" || element.type === "radio") {
          // Attempt to check if value indicates true
          if (["yes", "true", "1", "on"].includes(String(value).toLowerCase())) {
            element.checked = true;
          }
        } else {
          element.value = value;
        }
        // Trigger React/Angular events
        element.dispatchEvent(new Event("input", { bubbles: true }));
        element.dispatchEvent(new Event("change", { bubbles: true }));
        filledCount++;
      } else if (element.tagName === "SELECT") {
        // Try to match value with options
        const options = Array.from(element.options);
        const match = options.find(opt => opt.text.toLowerCase().includes(String(value).toLowerCase()) || opt.value === value);
        if (match) {
          element.value = match.value;
          element.dispatchEvent(new Event("change", { bubbles: true }));
          filledCount++;
        }
      }
      
      // Highlight the field briefly
      const originalBg = element.style.backgroundColor;
      element.style.backgroundColor = "#dbeafe"; // light blue
      setTimeout(() => {
        element.style.backgroundColor = originalBg;
      }, 2000);
    }
  });
  
  console.log(`Successfully filled ${filledCount} fields.`);
  alert(`IntelliJob AI successfully filled ${filledCount} fields. Please review before submitting.`);
}
