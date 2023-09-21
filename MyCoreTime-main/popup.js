// Request the current time from background.js when popup is opened
const port = chrome.runtime.connect({ name: 'popup' });
port.postMessage({ type: 'requestTime' });
let isStarted = false;
let time;
/*
let startedTime;
let afterAlarmTime;*/

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
        time = message.time;
        document.getElementById("timer").innerText = time;
    }
});

// Start button
document.getElementById("start").addEventListener("click", () => {
    isStarted = true;
    chrome.runtime.sendMessage({ type: 'startTimer' });
});

// Pause button
document.getElementById("pause").addEventListener("click", () => {
    isStarted = false;
    chrome.runtime.sendMessage({ type: 'pauseTimer' });
});

// Stop button
document.getElementById("stop").addEventListener("click", () => {
    isStarted = false;
    //chrome.alarms.clearAll();
    chrome.runtime.sendMessage({ type: 'stopTimer' });
    chrome.runtime.sendMessage({ type: 'sendLoggedTime' });
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

/*
document.getElementById("alarm").addEventListener("click", () => {
    const alarmBox = document.getElementById("alarmBox");
    alarmBox.style.display = "block";

    document.getElementById("setAlarm").addEventListener("click", () => {
        if (isStarted == true) {
            const alarmTime = parseInt(document.getElementById("alarmTime").value); //millisec
            startedTime = document.getElementById("timer").innerText;
            const startedTimeSec = parseTimeToMilliSeconds(startedTime);

            afterAlarmTime = formatTime(alarmTime + startedTimeSec);

            chrome.alarms.create({ delayInMinutes: alarmTime / 60000 });
            
            alert(`Alarm set for ${alarmTime / 60000} minutes.`);
        } else {
            alert("The log timer hasn't started yet");
        }
        alarmBox.style.display = "none";
    });

    document.getElementById("cancelAlarm").addEventListener("click", () => {
        chrome.alarms.clear();
        alert("Alarm canceled.");
        alarmBox.style.display = "none";
    });
});

// Listen for the alarm event
if (startedTime === afterAlarmTime) {
    chrome.alarms.onAlarm.addListener(() => {
        alert('Alarm!!!');
    });
}

function parseTimeToMilliSeconds(time) {
    const [hours, minutes, seconds] = time.split(':');
    return (parseInt(hours) * 60 * 60 + parseInt(minutes) * 60 + parseInt(seconds)) * 1000;
}
*/

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