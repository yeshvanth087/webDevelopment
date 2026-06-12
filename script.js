const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const filterBtns = document.querySelectorAll(".filter-btn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// Save tasks
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Display tasks
function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(task => {

        if (currentFilter === "active")
            return !task.completed;

        if (currentFilter === "completed")
            return task.completed;

        return true;
    });

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.innerHTML = `
            <span class="${task.completed ? 'completed' : ''}">
                ${task.text}
            </span>

            <div class="actions">
                <button class="toggle" data-id="${task.id}">
                    ✓
                </button>

                <button class="edit" data-id="${task.id}">
                    Edit
                </button>

                <button class="delete" data-id="${task.id}">
                    Delete
                </button>
            </div>
        `;

        taskList.appendChild(li);
    });
}

// Create Task
addBtn.addEventListener("click", () => {

    const text = taskInput.value.trim();

    if (text === "") return;

    tasks.push({
        id: Date.now(),
        text: text,
        completed: false
    });

    taskInput.value = "";

    saveTasks();
    renderTasks();
});

// Event Delegation
taskList.addEventListener("click", (e) => {

    const id = Number(e.target.dataset.id);

    // Delete
    if (e.target.classList.contains("delete")) {

        tasks = tasks.filter(task => task.id !== id);
    }

    // Toggle Complete
    if (e.target.classList.contains("toggle")) {

        tasks = tasks.map(task => {

            if (task.id === id) {
                task.completed = !task.completed;
            }

            return task;
        });
    }

    // Edit
    if (e.target.classList.contains("edit")) {

        const task = tasks.find(task => task.id === id);

        let updatedText = prompt("Edit Task", task.text);

        if (updatedText !== null && updatedText.trim() !== "") {
            task.text = updatedText;
        }
    }

    saveTasks();
    renderTasks();
});

// Filters
filterBtns.forEach(btn => {

    btn.addEventListener("click", () => {

        currentFilter = btn.dataset.filter;

        filterBtns.forEach(b => b.classList.remove("active"));

        btn.classList.add("active");

        renderTasks();
    });
});

// Initial Render
renderTasks();