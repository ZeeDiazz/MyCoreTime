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

function updateTimer() {
  const currentTime = Date.now();
  if (!isPaused) { //update only if paused
    elapsedTime = currentTime - startTime - totalPauseTime;
    document.getElementById("timer").innerText = formatTime(elapsedTime);
  }
}

//Start button
document.getElementById("start").addEventListener("click", () => {
  if (!timerInterval) {
    if (isPaused) {
      totalPauseTime += Date.now() - pauseStartTime;
    }
    startTime = Date.now() - elapsedTime - totalPauseTime;
    timerInterval = setInterval(updateTimer, 1000); // Update every second.
  }
  isPaused = false;
});

//Paused button
document.getElementById("pause").addEventListener("click", () => {
  if (!isPaused && timerInterval) {
    isPaused = true;
    pauseStartTime = Date.now(); // Store the time when pause was pressed.
    clearInterval(timerInterval); // Stop the timer.
    timerInterval = null;
  }
});
//Stop button
document.getElementById("stop").addEventListener("click", () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  const logTime = confirm("Do you want to log this time in History?");
  if (logTime) {
    const formattedTime = formatTime(elapsedTime);
    
    //Time logged:
    saveTimeLog(`${formattedTime}`);
  }
  resetTimer();
});

//Reset timer when pressed Stop
function resetTimer() {
  elapsedTime = 0;
  totalPauseTime = 0;
  document.getElementById("timer").innerText = "00:00:00"; // Resets the timer to 00:00:00
}

  
  // View history button
  document.getElementById("viewhistory").addEventListener("click", () => {
    window.location.href = "history.html";
  });
  

// Function to save the log to local storage
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

//Used for saving the time as a .txt
/*function saveTimeLog(log) {
  const blob = new Blob([log], { type: "text/plain"});
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "LoggedTime.txt";
  a.click();

  URL.revokeObjectURL(url);
}*/