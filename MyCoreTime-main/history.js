
// Function to load and display logged times
function loadTimeHistory() {
    // You can fetch data from a text file or another source here.

  
    const historyContainer = document.getElementById("historycontainer");
    historyContainer.innerHTML = "";
  
    exampleTimes.forEach((log) => {
      const logElement = document.createElement("p");
      logElement.textContent = log;
      historyContainer.appendChild(logElement);
    });
  }
  
  // Load and display logged times when the history page is loaded
  window.addEventListener("load", loadTimeHistory);
  
  // Back to Main button click event
  document.getElementById("backtomain").addEventListener("click", () => {
    // Redirect back to the main page (index.html) or use your navigation logic.
    window.location.href = "index.html";
  });

  function clearTimeHistory() {
    // Clear the history in local storage
    localStorage.removeItem("timeHistory");
  
    // Refresh the displayed history
    loadTimeHistory();
  }
  
  // Add an event listener for the "Clear History" button
  document.getElementById("clearhistory").addEventListener("click", clearTimeHistory);
  
  
  // Function to load and display logged times from local storage
  function loadTimeHistory() {
    const historyContainer = document.getElementById("historytable").getElementsByTagName('tbody')[0];
    historyContainer.innerHTML = "";
  
    // Retrieve the history from local storage
    const timeHistory = JSON.parse(localStorage.getItem("timeHistory")) || [];
  
    /*timeHistory.forEach((log) => {
      const logElement = document.createElement("p");
      logElement.textContent = log;
      historyContainer.appendChild(logElement);
    });
  }*/

    timeHistory.forEach((log) => {
      const [loggedTime, timeOfLogged, loggedDate] = log.split(", ");
      const row = historyContainer.insertRow();
      const cell1 = row.insertCell(0);
      const cell2 = row.insertCell(1);
      const cell3 = row.insertCell(2);
      cell1.textContent = loggedTime;
      cell2.textContent = timeOfLogged;
      cell3.textContent = loggedDate;
    });
  }
  window.addEventListener("load", loadTimeHistory);
