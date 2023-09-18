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
  chrome.runtime.sendMessage({ type: 'sendLoggedTime' });
});

chrome.runtime.onMessage.addListener(function (message) {
  if (message.type === 'loggedTime' && message.time != '00:00:00') {
    const logTime = confirm(message.confirm);
    if (logTime) {
      saveTimeLog(`${message.time}`);
      resetTimer();
      chrome.runtime.sendMessage({ type: 'resetTimerNow' });
    }
  } else if (message.type === 'loggedTime') {
    alert(message.confirm);
  }
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
  const blob = new Blob([log], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  // Get the existing history or initialize an empty array
  const existingHistory = JSON.parse(localStorage.getItem("timeHistory")) || [];

  // Add the new log with date and time
  const now = new Date();
  const test = document.getElementById("comment").value;

  const testNoComma = test.replace(',', '--');

  const formattedDateTime = `${now.toLocaleTimeString()}, ${now.toLocaleDateString()}, ${testNoComma}`;
  const logWithDateTime = `${log}, ${formattedDateTime}`; //Format Timelog, TimeOfLog, Date

  existingHistory.push(logWithDateTime);

  // Store the updated history in local storage
  localStorage.setItem("timeHistory", JSON.stringify(existingHistory));
}