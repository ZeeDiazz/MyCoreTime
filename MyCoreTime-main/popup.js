// Request the current time from background.js when popup is opened
const port = chrome.runtime.connect({ name: 'popup' });
port.postMessage({ type: 'requestTime' });
let time;

// Add an event listener to receive updated time from background.js
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.type === 'updateTime') {
        time = message.time;
        document.getElementById("timer").innerText = time;
    }
});

function resetTimer() {
    elapsedTime = 0;
    totalPauseTime = 0;
    document.getElementById("timer").innerText = "00:00:00"; // Resets the timer to 00:00:00
}

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

document.getElementById("viewhistory").addEventListener("click", () => {
    window.location.href = "history.html";
});

const comment = document.getElementById("comment");
//Save the comment whenever there is a input
comment.addEventListener("input", () => {
    let saveCommentValue = comment.value;
    chrome.storage.local.set({ comment: saveCommentValue });
});

// when the popup opens do this
chrome.storage.local.get(["comment"], function (result) {
    if (result.comment) {
        comment.value = result.comment;
    }
});

chrome.runtime.onMessage.addListener(function (message) {
    if (message.type != 'loggedTime') {
        return;
    }
    if (message.time === '00:00:00') {
        alert(message.confirm);
        return;
    }
    const logTime = confirm(message.confirm);
    if (logTime) {
        saveTimeLog(`${message.time}`);
    } else {
        comment.value = '';
        chrome.storage.local.set({ comment: '' });
    }
    resetTimer();
    chrome.runtime.sendMessage({ type: 'resetTimerNow' });

});


function saveTimeLog(log) {
    const blob = new Blob([log], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    // Get the existing history or initialize an empty array
    const existingHistory = JSON.parse(localStorage.getItem("timeHistory")) || [];

    // Add the new log with date and time
    const now = new Date();
    const saveComment = comment.value;
    const testNoComma = saveComment.replace(',', '--');

    //reset the comment
    comment.value = '';
    chrome.storage.local.set({ comment: '' });

    const formattedDateTime = `${now.toLocaleTimeString()}, ${now.toLocaleDateString()}, ${testNoComma}`;
    const logWithDateTime = `${log}, ${formattedDateTime}`; //Format Timelog, TimeOfLog, Date

    existingHistory.push(logWithDateTime);

    // Store the updated history in local storage
    localStorage.setItem("timeHistory", JSON.stringify(existingHistory));
}