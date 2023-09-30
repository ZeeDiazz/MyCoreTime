let timerInterval;
let startTime = 0;
let elapsedTime = 0;

let isPaused = false;

let pauseStartTime = 0;
let totalPauseTime = 0;

function formatTime(milliseconds) {
    const seconds = Math.floor((milliseconds / 1000) % 60);
    const minutes = Math.floor((milliseconds / 1000 / 60) % 60);
    const hours = Math.floor(milliseconds / 1000 / 60 / 60);
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`; //format for 00:00:00
}

function resetTimer() {
    elapsedTime = 0;
    totalPauseTime = 0;
    document.getElementById("timer").innerText = "00:00:00"; // Resets the timer to 00:00:00
}

function updateTimer() {
    const currentTime = Date.now();
    if (isPaused) {
        return;
    }
    elapsedTime = currentTime - startTime;
    const formattedTime = formatTime(elapsedTime);

    // Send the updated time to all popup instances
    chrome.runtime.sendMessage({ type: 'updateTime', time: formattedTime });
}

function startTimer() {
    if (timerInterval) {
        return;
    }

    if (isPaused) {
        totalPauseTime += Date.now() - pauseStartTime;
        startTime += Date.now() - pauseStartTime;
    } else {
        startTime = Date.now() - elapsedTime - totalPauseTime;
    }

    timerInterval = setInterval(updateTimer, 1000); // Update every second.
    isPaused = false;
}

function pauseTimer() {
    if (isPaused) {
        return;
    }
    if (timerInterval == undefined) {
        return;
    }
    isPaused = true;
    pauseStartTime = Date.now(); // Store the time when paused.
    clearInterval(timerInterval); // Stop the timer.
    timerInterval = null;

}

function stopTimer() {
    if (timerInterval == undefined) {
        return;
    }
    clearInterval(timerInterval);
    timerInterval = null;
}

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    switch (message.type) {
        case 'startTimer':
            startTimer();
            break;
        case 'pauseTimer':
            pauseTimer();
            break;
        case 'stopTimer':
            stopTimer();
            break;
        case 'sendLoggedTime':
            wantToLogTime();
            break;
        case 'resetTimerNow':
            resetTimer();
            break;
        case 'saveThisComment':
            const commentbg = message.comment;
            chrome.storage.local.set({ comment: commentbg });
            break;
    }
});

function wantToLogTime() {
    let wantToLog = "";

    const formattedTime = formatTime(elapsedTime);

    if (formattedTime === '00:00:00') {
        wantToLog = "Can't log 00:00:00";
    } else {
        wantToLog = "Do you want to log?";
    }
    chrome.runtime.sendMessage({ type: 'loggedTime', time: formattedTime, confirm: wantToLog });
}

// When a popup is opened, send the current time to it
chrome.runtime.onConnect.addListener(function (port) {
    port.onMessage.addListener(function (message) {
        if (isPaused) {
            return;
        }
        if (message.type === 'requestTime') {
            const formattedTime = formatTime(elapsedTime);
            port.postMessage({ type: 'updateTime', time: formattedTime });
        }
    });
});
