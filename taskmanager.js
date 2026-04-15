let tasks = [];
let currentId = 0;
let editingId = null;

const modal = document.getElementById("modal");
const titleInput = document.getElementById("titleInput");
const descInput = document.getElementById("descInput");
const priorityInput = document.getElementById("priorityInput");
const dateInput = document.getElementById("dateInput");
const taskCount = document.getElementById("taskCount");

function createTaskCard(task) {

    const li = document.createElement("li");
    li.setAttribute("data-id", task.id);
    li.classList.add("task-card");

    const title = document.createElement("span");
    title.textContent = task.title;

    // Inline edit
    title.addEventListener("dblclick", function () {
        const input = document.createElement("input");
        input.value = task.title;

        input.addEventListener("blur", saveEdit);
        input.addEventListener("keydown", function(e){
            if(e.key === "Enter") saveEdit();
        });

        function saveEdit(){
            task.title = input.value;
            title.textContent = task.title;
            li.replaceChild(title, input);
        }

        li.replaceChild(input, title);
        input.focus();
    });

    const desc = document.createElement("p");
    desc.textContent = task.description;

    const priority = document.createElement("span");
    priority.textContent = task.priority;

    const date = document.createElement("small");
    date.textContent = task.date;

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.setAttribute("data-action", "edit");
    editBtn.setAttribute("data-id", task.id);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.setAttribute("data-action", "delete");
    deleteBtn.setAttribute("data-id", task.id);

    li.appendChild(title);
    li.appendChild(desc);
    li.appendChild(priority);
    li.appendChild(date);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    return li;
}

/* =========================
   ADD TASK
========================= */
function addTask(columnId, task) {
    tasks.push(task);

    const column = document.querySelector(`#${columnId} ul`);
    column.appendChild(createTaskCard(task));

    updateCounter();
}

/* =========================
   DELETE TASK
========================= */
function deleteTask(id) {
    const card = document.querySelector(`[data-id="${id}"]`);
    card.classList.add("fade-out");

    setTimeout(() => {
        card.remove();
        tasks = tasks.filter(t => t.id !== id);
        updateCounter();
    }, 300);
}


function editTask(id) {
    const task = tasks.find(t => t.id === id);

    titleInput.value = task.title;
    descInput.value = task.description;
    priorityInput.value = task.priority;
    dateInput.value = task.date;

    editingId = id;
    modal.classList.remove("hidden");
}


function updateTask(id) {
    const task = tasks.find(t => t.id === id);

    task.title = titleInput.value;
    task.description = descInput.value;
    task.priority = priorityInput.value;
    task.date = dateInput.value;

    const card = document.querySelector(`[data-id="${id}"]`);
    card.children[0].textContent = task.title;
    card.children[1].textContent = task.description;
    card.children[2].textContent = task.priority;
    card.children[3].textContent = task.date;
}


document.querySelectorAll("ul").forEach(list => {
    list.addEventListener("click", function (e) {

        const action = e.target.getAttribute("data-action");
        const id = parseInt(e.target.getAttribute("data-id"));

        if (!action) return;

        if (action === "delete") deleteTask(id);
        if (action === "edit") editTask(id);
    });
});

/* =========================
   ADD BUTTON
========================= */
document.querySelectorAll(".addBtn").forEach(btn => {
    btn.addEventListener("click", function () {
        modal.classList.remove("hidden");
        editingId = null;
        this.closest("section").setAttribute("data-column", this.parentElement.id);
    });
});

/* =========================
   SAVE BUTTON
========================= */
document.getElementById("saveBtn").addEventListener("click", function () {

    if (editingId !== null) {
        updateTask(editingId);
    } else {
        const column = document.querySelector("[data-column]").getAttribute("data-column");

        const task = {
            id: currentId++,
            title: titleInput.value,
            description: descInput.value,
            priority: priorityInput.value,
            date: dateInput.value
        };

        addTask(column, task);
    }

    modal.classList.add("hidden");
});

/* =========================
   CANCEL BUTTON
========================= */
document.getElementById("cancelBtn").addEventListener("click", () => {
    modal.classList.add("hidden");
});

/* =========================
   FILTER
========================= */
document.getElementById("priorityFilter").addEventListener("change", function () {
    const value = this.value;

    document.querySelectorAll(".task-card").forEach(card => {
        const priority = card.children[2].textContent;

        card.classList.toggle("is-hidden", value !== "all" && priority !== value);
    });
});

/* =========================
   CLEAR DONE (STAGGER)
========================= */
document.getElementById("clearDone").addEventListener("click", function () {

    const cards = document.querySelectorAll("#done .task-card");

    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add("fade-out");

            setTimeout(() => {
                card.remove();
            }, 300);

        }, index * 100);
    });

    tasks = tasks.filter(t => t.column !== "done");
    updateCounter();
});

/* =========================
   COUNTER
========================= */
function updateCounter() {
    taskCount.textContent = tasks.length;
}