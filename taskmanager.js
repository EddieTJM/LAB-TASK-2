let tasks = [];
let currentId = 0;
let selectedColumn = "todo";

const modal = document.getElementById("modal");
const titleInput = document.getElementById("titleInput");
const descInput = document.getElementById("descInput");
const priorityInput = document.getElementById("priorityInput");
const dateInput = document.getElementById("dateInput");
const taskCount = document.getElementById("taskCount");

/* CREATE CARD */
function createTaskCard(task) {
    const li = document.createElement("li");
    li.className = "task-card " + task.priority;
    li.dataset.id = task.id;

    li.innerHTML = `
        <strong>${task.title}</strong>
        <p>${task.description}</p>
        <small>${task.date}</small><br>
        <button data-action="edit">Edit</button>
        <button data-action="delete">Delete</button>
    `;

    return li;
}

/* ADD TASK */
function addTask(task) {
    tasks.push(task);

    const column = document.querySelector(`#${task.column} ul`);
    column.appendChild(createTaskCard(task));

    updateCounter();
}

/* DELETE */
function deleteTask(id) {
    const card = document.querySelector(`[data-id="${id}"]`);
    if (!card) return;

    card.classList.add("fade-out");

    setTimeout(() => {
        card.remove();
        tasks = tasks.filter(t => t.id !== id);
        updateCounter();
    }, 300);
}

/* EDIT */
function editTask(id) {
    const task = tasks.find(t => t.id === id);

    titleInput.value = task.title;
    descInput.value = task.description;
    priorityInput.value = task.priority;
    dateInput.value = task.date;

    selectedColumn = task.column;
    editingId = id;
    modal.classList.remove("hidden");
}

/* UPDATE */
function updateTask(id) {
    const task = tasks.find(t => t.id === id);

    task.title = titleInput.value;
    task.description = descInput.value;
    task.priority = priorityInput.value;
    task.date = dateInput.value;

    document.querySelector(`[data-id="${id}"]`).remove();
    addTask(task);
}

/* EVENTS */

// Add buttons
document.querySelectorAll(".addBtn").forEach(btn => {
    btn.onclick = function () {
        selectedColumn = this.parentElement.id;
        modal.classList.remove("hidden");
        editingId = null;
    };
});

// Save
let editingId = null;

document.getElementById("saveBtn").onclick = () => {

    if (!titleInput.value) return;

    if (editingId !== null) {
        updateTask(editingId);
    } else {
        addTask({
            id: currentId++,
            title: titleInput.value,
            description: descInput.value,
            priority: priorityInput.value,
            date: dateInput.value,
            column: selectedColumn
        });
    }

    modal.classList.add("hidden");
    clearInputs();
};

// Cancel
document.getElementById("cancelBtn").onclick = () => {
    modal.classList.add("hidden");
};

/* CLICK ACTIONS */
document.querySelectorAll("ul").forEach(list => {
    list.onclick = e => {
        const card = e.target.closest(".task-card");
        if (!card) return;

        const id = Number(card.dataset.id);

        if (e.target.dataset.action === "delete") deleteTask(id);
        if (e.target.dataset.action === "edit") editTask(id);
    };
});

/* FILTER */
document.getElementById("priorityFilter").onchange = function () {
    const value = this.value;

    document.querySelectorAll(".task-card").forEach(card => {
        card.style.display =
            value === "all" || card.classList.contains(value)
                ? "block"
                : "none";
    });
};

/* CLEAR DONE */
document.getElementById("clearDone").onclick = () => {
    document.querySelector("#done ul").innerHTML = "";
    tasks = tasks.filter(t => t.column !== "done");
    updateCounter();
};

/* HELPERS */
function updateCounter() {
    taskCount.textContent = tasks.length;
}

function clearInputs() {
    titleInput.value = "";
    descInput.value = "";
    priorityInput.value = "low";
    dateInput.value = "";
}