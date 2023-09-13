// Request the current time from background.js when popup is opened
const port = chrome.runtime.connect({ name: 'popup' });
port.postMessage({ type: 'requestTime' });

// Initialize background page
function formatTime(milliseconds) {
  const seconds = Math.floor((milliseconds / 1000) % 60);
  const minutes = Math.floor((milliseconds / 1000 / 60) % 60);
  const hours = Math.floor(milliseconds / 1000 / 60 / 60);
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`; //format for 00:00:00
}

// Add an event listener to receive updated time from background.js
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.type === 'updateTime') {
    document.getElementById("timer").innerText = message.time;
  }
});

// Start button
document.getElementById("start").addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: 'startTimer' });
});

// Pause button
document.getElementById("pause").addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: 'pauseTimer' });
});

// Stop button
document.getElementById("stop").addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: 'stopTimer' });
  const logTime = confirm("Do you want to log this time in History?");
  if (logTime) {
    chrome.runtime.sendMessage({ type: 'logTimeYESNO' });
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
      if (message.type === 'updateTime') {
        const format = message.time;
        saveTimeLog(`${format}`);
      }
    });
  }
  resetTimer();
});

document.getElementById("viewhistory").addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: 'viewHis' });
  window.location.href = "history.html";
});

function resetTimer() {
  elapsedTime = 0;
  totalPauseTime = 0;
  document.getElementById("timer").innerText = "00:00:00"; // Resets the timer to 00:00:00
}
function saveTimeLog(log) {
  const blob = new Blob([log], { type: "text/plain"});
  const url = URL.createObjectURL(blob);
  // Get the existing history or initialize an empty array
  const existingHistory = JSON.parse(localStorage.getItem("timeHistory")) || [];
    
  // Add the new log with date and time
  const now = new Date();

  const formattedDateTime =`${now.toLocaleTimeString()}, ${now.toLocaleDateString()}`;
  const logWithDateTime = `${log}, ${formattedDateTime}`; //Format Timelog, TimeOfLog, Date

  existingHistory.push(logWithDateTime);
    
    // Store the updated history in local storage
    localStorage.setItem("timeHistory", JSON.stringify(existingHistory));
}