function loadTimeHistory() {
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
  
  // Back to Main button
  document.getElementById("backtomain").addEventListener("click", () => {
    // back to index file
    window.location.href = "index.html";
  });

  function clearTimeHistory() {
    // delete the history
    localStorage.removeItem("timeHistory");
  
    loadTimeHistory();
  }
  
  // Clear button 
  document.getElementById("clearhistory").addEventListener("click", clearTimeHistory);
  
  
  function loadTimeHistory() {
    const historyContainer = document.getElementById("historytable").getElementsByTagName('tbody')[0];
    historyContainer.innerHTML = "";
  
    // logged history from local storage
    const timeHistory = JSON.parse(localStorage.getItem("timeHistory")) || [];
  
    /*timeHistory.forEach((log) => {
      const logElement = document.createElement("p");
      logElement.textContent = log;
      historyContainer.appendChild(logElement);
    });
  }*/
    //Table(rows) for each logging
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
