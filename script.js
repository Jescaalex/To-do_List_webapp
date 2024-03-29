// Add task
const addTask = () => {
    const taskInput = document.getElementById("taskInput");
    const taskList = document.getElementById("taskList");
    // Get the task input value
    const taskText = taskInput.value.trim();
    // If task input is not empty
    if (taskText !== "") {
        const taskObject = {
            id: generateTaskId(), // Generate unique id for each task.
            text: taskText,
            completed: false,
            created: currentDate()
        }
        // Store tasks into local storage
        storeTasksIntoLocaleStorage(taskObject);
        createTaskRow(taskObject, taskTable);
        // Clear the task input
        taskInput.value = "";
    }
}

// Mark task as complete
const addMarkTaskAsCompleteButton = (completeButtonCell, task, taskTextCell) => {
    // Create complete button
    const completeButton = document.createElement("button");
    completeButton.innerText = "Complete";
    completeButton.onclick = function () {
        task = updateTaskStatusInLocalStorage(task)
        taskTextCell.classList.toggle("completed" , task.completed);
    };
    completeButtonCell.appendChild(completeButton);
}

// Delete task 
const addDeleteTaskButton = (taskText, listItem) => {
    // Add delete button to the list item
    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.className = "delete";
    deleteButton.onclick = function () {
        listItem.remove();
        deleteTaskFromLocaleStorage(taskText);
        window.location.reload() 
    };
    listItem.appendChild(deleteButton);
}

// Store tasks into local storage
const storeTasksIntoLocaleStorage = (task) => {
    const tasks = retrieveTasksFromLocalStorage();
    // Append new task to the array
    tasks.push(task);
    /**
     * Convert tasks array to string using JSON.stringify() method.
     *  Because localStorage only accepts strings.
     */
    const stringifiedTasks = JSON.stringify(tasks);
    // We use "tasks" as key associated with tasks array.
    localStorage.setItem("tasks", stringifiedTasks);
}

// Retrieve tasks from local storage
const retrieveTasksFromLocalStorage = () => {
    // Retrieve tasks from local storage using getItem() method.
    const tasks = localStorage.getItem("tasks") || "";

    // If tasks is null or empty, return an empty array
    if (!tasks) {
        return [];
    }

    // Parse the stringified tasks using JSON.parse() method.
    return JSON.parse(tasks);
}

// Delete task from local storage
const deleteTaskFromLocaleStorage = (taskId) => {
    let tasks = retrieveTasksFromLocalStorage();
    const index = tasks.findIndex(task => task.id === taskId);
    if (index > -1) {
        tasks.splice(index, 1); // Remove task from tasks array
        localStorage.setItem("tasks", JSON.stringify(tasks)); // Update tasks in local storage
        // Update the task list without reloading the page
        populateTaskList();
        alert(`Task with ID "${taskId}" deleted successfully.`);
    } else {
        alert(`Task with ID "${taskId}" not found.`);
    }
}

const populateTaskList = () => {
    const tasks = retrieveTasksFromLocalStorage();
    const taskTable = document.getElementById("taskTable");
    tasks.forEach((task) => {
        createTaskRow(task, taskTable);
    });
}

const currentDate = () => {
    // Get current date
    const currentDate = new Date();

    // Get year, month, and day
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adding 1 because months are zero-based
    const day = String(currentDate.getDate()).padStart(2, '0');

    // Output in the format of year, month, and day
    return `${year}-${month}-${day}`;

}

// Generate the Table's row
const createTaskRow = (task, taskTable) => {
    // Create a new row for each task
    const row = taskTable.insertRow();

    // Create cells for task text, completed status, created date, delete button, and complete button
    const taskTextCell = row.insertCell(0);
    const completedStatusCell = row.insertCell(1);
    const createdDateCell = row.insertCell(2);
    const deleteButtonCell = row.insertCell(3);
    const completeButtonCell = row.insertCell(4);

    // Set the content of each cell
    taskTextCell.textContent = task.text;
    completedStatusCell.textContent = task.completed ? "Completed" : "Not Completed";
    createdDateCell.textContent = task.created;

    // Add delete button
    addDeleteTaskButton(task.id, deleteButtonCell);

    // Add complete button
    addMarkTaskAsCompleteButton(completeButtonCell, task.id, taskTextCell);
    // Optionally, you can add classes to cells for styling
    taskTextCell.classList.add(task.completed ? "completed" : "not-completed");
}

const updateTaskStatusInLocalStorage = (taskId) => {
    // Retrieve tasks from localStorage
    let tasks = retrieveTasksFromLocalStorage();

    // Find the index of the task with the given taskId
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    // If task is found, update its status
    if (taskIndex !== -1) {
        let task = tasks[taskIndex]
        task.completed = !task.completed;
        // Update tasks in localStorage
        localStorage.setItem("tasks", JSON.stringify(tasks));
        return task;
    }
    else {
        alert('Task is not found');
    }
};

const generateTaskId = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const idLength = 8; // Length of the generated ID
    let id = '';
    for (let i = 0; i < idLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        id += characters.charAt(randomIndex);
    }
    return id;
};


// Retrive tasks from the local storage and populate the task list on the page load
window.onload = populateTaskList();
