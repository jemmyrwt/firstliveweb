const API = "https://firstliveweb.onrender.com";

/* ================= DOM ================= */

// AUTH (agar future me login screen add karo)
const loginScreen = document.getElementById("loginScreen");
const todoScreen = document.getElementById("todoScreen");

// ZENTASK
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const welcomeText = document.getElementById("welcomeText");

const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const doneCount = document.getElementById("doneCount");

/* ================= STATE ================= */

let token = localStorage.getItem("token");
let tasks = [];
let filter = "all";

/* ================= INIT ================= */

document.getElementById("dateText").innerText =
  new Date().toDateString();

if (token) {
  showTodoScreen();
}

/* ================= AUTH HELPERS ================= */

function showTodoScreen() {
  if (loginScreen) loginScreen.style.display = "none";
  if (todoScreen) todoScreen.style.display = "block";
  loadTodos();
}

function logout() {
  localStorage.removeItem("token");
  location.reload();
}

/* ================= TODOS (API CONNECTED) ================= */

async function loadTodos() {
  try {
    const res = await fetch(API + "/api/todos", {
      headers: {
        Authorization: "Bearer " + token
      }
    });

    if (!res.ok) {
      logout();
      return;
    }

    tasks = await res.json();
    renderTasks();
    updateStats();
  } catch (err) {
    alert("Failed to load todos");
  }
}

async function addNewTask() {
  const text = taskInput.value.trim();
  const category = document.getElementById("categorySelect")?.value || "work";
  const priority = document.getElementById("prioritySelect")?.value || "low";

  if (!text) {
    alert("Kuch toh likho!");
    return;
  }

  await fetch(API + "/api/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({
      text,
      category,
      priority,
      done: false
    })
  });

  taskInput.value = "";
  loadTodos();
}

async function deleteTask(id) {
  await fetch(API + "/api/todos/" + id, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token
    }
  });
  loadTodos();
}

/* ================= UI HELPERS ================= */

function toggleTask(id) {
  // optional future: PATCH /api/todos/:id
  alert("Complete feature next step me add karenge");
}

function filterTasks(type) {
  filter = type;
  document.querySelectorAll(".menu-item")
    .forEach(m => m.classList.remove("active"));
  event.target.classList.add("active");
  renderTasks();
}

function renderTasks() {
  taskList.innerHTML = "";

  let filtered = tasks;

  if (filter === "completed") {
    filtered = tasks.filter(t => t.done);
  } else if (filter !== "all") {
    filtered = tasks.filter(t => t.category === filter);
  }

  filtered.forEach(task => {
    const item = document.createElement("div");
    item.className = `task-card ${task.done ? "completed" : ""}`;

    item.innerHTML = `
      <div class="task-info">
        <div class="check-circle" onclick="toggleTask('${task._id}')"></div>
        <div>
          <span class="task-text">${task.text}</span><br>
          <span class="tag ${
            task.priority === "high" ? "priority-high" : "priority-low"
          }">${task.priority}</span>
          <span style="font-size:0.7rem;color:var(--text-sub)">
            #${task.category || "work"}
          </span>
        </div>
      </div>
      <i class="fas fa-trash-alt delete-btn"
         onclick="deleteTask('${task._id}')"></i>
    `;

    taskList.appendChild(item);
  });
}

function updateStats() {
  totalCount.innerText = tasks.length;
  pendingCount.innerText = tasks.filter(t => !t.done).length;
  doneCount.innerText = tasks.filter(t => t.done).length;
}

/* ================= THEME ================= */

function toggleTheme() {
  const body = document.body;
  const icon = document.querySelector(".theme-toggle i");

  if (body.getAttribute("data-theme") === "light") {
    body.setAttribute("data-theme", "dark");
    icon.className = "fas fa-sun";
  } else {
    body.setAttribute("data-theme", "light");
    icon.className = "fas fa-moon";
  }
}
