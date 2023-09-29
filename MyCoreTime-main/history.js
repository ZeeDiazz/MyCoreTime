const a = document.createElement("a");
let selectedLogs = [];

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

    timeHistory.reverse();
    //Table(rows) for each logging
    timeHistory.forEach((log, index) => {
        const [loggedTime, timeOfLogged, loggedDate, commentNoComma] = log.split(", ");
        const comment = commentNoComma.replace('--', ',');
        const row = historyContainer.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        const cell4 = row.insertCell(3);
        const cell5 = row.insertCell(4);
        const cell6 = row.insertCell(5);

        // Add a checkbox to the first cell
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.addEventListener("change", () => updateSelectedLogs());
        cell1.appendChild(checkbox);


        cell2.textContent = loggedTime;
        cell3.textContent = timeOfLogged;
        cell4.textContent = loggedDate;
        cell5.textContent = comment;

        //edit log coloum 
        const editButton = document.createElement("img");
        editButton.src = "/images/editIcon25.png";
        editButton.classList.add("editButton"); //to make the hover action
        editButton.addEventListener("click", () => editLog(index));
        cell6.appendChild(editButton);

    });
}

function updateSelectedLogs() {
    selectedLogs = [];
    const checkboxes = document.querySelectorAll("#historytable tbody input[type='checkbox']");
    checkboxes.forEach((checkbox, index) => {
        if (checkbox.checked) {
            selectedLogs.push(index);
        }
    });
}

document.getElementById("downloadAll").addEventListener("click", () => {
    const selectedLogData = selectedLogs.map((index) => {
        return JSON.parse(localStorage.getItem("timeHistory"))[index];
    });
    if (selectedLogData.length > 0) {
        const combinedLog = selectedLogData.join("\n");
        downloadLog(combinedLog);
    } else {
        alert("No logs selected for download.");
    }
    a.clearTimeHistory();
});


function editLog(index) {
    const logIndex = index;
    const timeHistory = JSON.parse(localStorage.getItem("timeHistory")) || [];
    timeHistory.reverse(); //The original 

    // Get the current comment associated with the log entry
    const [, , , currentComment] = timeHistory[logIndex].split(", ");


    const editedCommentField = document.getElementById("editedDesc");
    editedCommentField.value = currentComment;

    // Display the edit form
    const editForm = document.getElementById("editBox");
    editForm.style.display = "block";

    // Save button
    document.getElementById("saveEdit").addEventListener("click", () => {

        //assign the new comment to the old
        const editedComment = editedCommentField.value;
        const [loggedTime, timeOfLogged, loggedDate] = timeHistory[logIndex].split(", ");
        const updatedLogEntry = `${loggedTime}, ${timeOfLogged}, ${loggedDate}, ${editedComment}`; //replace the old with new
        timeHistory[logIndex] = updatedLogEntry; //set the new log where the old was
        timeHistory.reverse(); // in reverse so the newest added log is showed at the top
        localStorage.setItem("timeHistory", JSON.stringify(timeHistory));

        // make it invensible
        editForm.style.display = "none";

        loadTimeHistory();
    });

    // Cancel button
    document.getElementById("cancelEdit").addEventListener("click", () => {
        // make it invensible
        editForm.style.display = "none";
    });

    // delete button
    document.getElementById("deleteEdit").addEventListener("click", () => {

        //remove the given log from the array
        timeHistory.splice(logIndex, 1);
        //back to normal
        timeHistory.reverse();
        // in reverse so the newest added log is showed at the top
        localStorage.setItem("timeHistory", JSON.stringify(timeHistory));
        // make it invensible
        editForm.style.display = "none";

        loadTimeHistory();
    });

}

document.getElementById("fileType").addEventListener("change", () => {
    fileType = document.getElementById("fileType").value;
});
// Function to trigger the download action
function downloadLog(log) {
    const selectForm = document.getElementById("selectBox");
    selectForm.style.display = "block";

    const downloadButton = document.getElementById("downloadConfirm");

    // Remove previous event listeners
    const newDownloadButton = downloadButton.cloneNode(true);
    downloadButton.parentNode.replaceChild(newDownloadButton, downloadButton);

    newDownloadButton.addEventListener("click", () => {
        if (fileType == 'None') {
            alert('Nope');
        } else {
            let filename = "LoggedTime" + fileType;
            const blob = new Blob([log], { type: "text/plain" });

            a.href = URL.createObjectURL(blob);
            a.download = filename;

            a.click();
            selectForm.style.display = "none";

            const checkboxes = document.querySelectorAll("#historytable tbody input[type='checkbox']");
            checkboxes.forEach((checkbox) => {
                checkbox.checked = false;
            });
        }
    });
    // Cancel button
    document.getElementById("downloadCancel").addEventListener("click", () => {
        // make it invensible
        selectForm.style.display = "none";
    });
}

window.addEventListener("load", loadTimeHistory);
