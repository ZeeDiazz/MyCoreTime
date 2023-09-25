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

        cell1.textContent = loggedTime;
        cell2.textContent = timeOfLogged;
        cell3.textContent = loggedDate;
        cell4.textContent = comment;

        //edit log coloum 
        const editButton = document.createElement("img");
        editButton.src = "/images/editIcon25.png";
        editButton.classList.add("editButton"); //to make the hover action
        editButton.addEventListener("click", () => editLog(index));
        cell5.appendChild(editButton);

        const downloadButton = document.createElement("img");
        downloadButton.src = "/images/downloadIcon25.png";
        downloadButton.classList.add("downloadButton");
        downloadButton.addEventListener("click", () => downloadLog(log)); // Call the download function
        cell6.appendChild(downloadButton);

    });
}

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
    const saveEditButton = document.getElementById("saveEdit");
    saveEditButton.addEventListener("click", () => {

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
    const cancelEditButton = document.getElementById("cancelEdit");
    cancelEditButton.addEventListener("click", () => {
        // make it invensible
        editForm.style.display = "none";
    });

    // delete button
    const deleteEditButton = document.getElementById("deleteEdit");
    deleteEditButton.addEventListener("click", () => {

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
// Function to trigger the download action
function downloadLog(log) {
    const selectForm = document.getElementById("selectBox");
    selectForm.style.display = "block";

    let fileType = document.getElementById("fileType").value;

    const downloadButton = document.getElementById("downloadConfirm");
    downloadButton.addEventListener("click", () => {

        const filename = "LoggedTime." + fileType;
        const blob = new Blob([log], { type: "text/plain" });

        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = filename;

        a.click();
        selectForm.style.display = "none";
    });
     // Cancel button
    const cancelDownloadButton = document.getElementById("cancelDownload");
    cancelDownloadButton.addEventListener("click", () => {
        // make it invensible
        selectForm.style.display = "none";
    });
}

window.addEventListener("load", loadTimeHistory);
