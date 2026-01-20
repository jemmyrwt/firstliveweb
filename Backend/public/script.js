const API = "https://firstliveweb.onrender.com";
const token = localStorage.getItem("token");

if (!token) {
  alert("Please login first");
  window.location.href = "/";
}

let tasks = [];
let timer = null;
let timeLeft = 1500;

/* INIT */
function init() {
  setupNavigation();
  updateClock();
  setInterval(updateClock, 1000);
  loadTasks();
}
init();

/* CLOCK */
function updateClock() {
  const clock = document.getElementById("live-clock");
  if (clock) {
    clock.innerText =
      new Date().toLocaleTimeString() +
      " | " +
      new Date().toDateString();
  }
}

/* LOAD TASKS */
async function loadTasks() {
  const res = await fetch(API + "/api/todos", {
    headers: { Authorization: "Bearer " + token }
  });
  tasks = await res.json();
  renderTasks();
  updateAnalytics();
}

/* ADD TASK */
document.getElementById("addBtn").addEventListener("click", async () => {
  const title = taskTitle.value;
  if (!title.trim()) return;

  await fetch(API + "/api/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({
      title,
      prio: prioVal.value,
      cat: catVal.value,
      date: dateVal.value
    })
  });

  taskTitle.value = "";
  loadTasks();
});

/* TOGGLE */
async function toggleTask(id) {
  await fetch(API + "/api/todos/" + id, {
    method: "PATCH",
    headers: { Authorization: "Bearer " + token }
  });
  loadTasks();
}

/* DELETE */
async function deleteTask(id) {
  await fetch(API + "/api/todos/" + id, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token }
  });
  loadTasks();
}

/* RENDER */
function renderTasks() {
  const grid = document.getElementById("taskGrid");
  grid.innerHTML = "";

  tasks.forEach(t => {
    const div = document.createElement("div");
    div.className = "task-card";
    div.innerHTML = `
      <div onclick="toggleTask('${t._id}')">
        <i class="${t.done ? "fas fa-check-circle" : "far fa-circle"}"></i>
      </div>
      <div style="flex:1">
        <h4 style="${t.done ? "text-decoration:line-through;opacity:.5" : ""}">
          ${t.title}
        </h4>
        <small>#${t.cat} | ${t.date || "No Deadline"}</small>
      </div>
      <i class="fas fa-trash" onclick="deleteTask('${t._id}')"></i>
    `;
    grid.appendChild(div);
  });
}

/* ANALYTICS */
function updateAnalytics() {
  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  stat-total.innerText = total;
  stat-efficiency.innerText = pct + "%";
  ring-pct.innerText = pct + "%";
  ring.style.strokeDashoffset = 377 - (377 * pct) / 100;
}

/* NAV */
function setupNavigation() {
  document.querySelectorAll(".nav-btn, .m-nav-item").forEach(btn => {
    btn.onclick = () => {
      const v = btn.dataset.view;
      document.querySelectorAll(".view").forEach(x => x.classList.remove("active"));
      document.getElementById("view-" + v).classList.add("active");
    };
  });
}

/* THEME */
function toggleTheme() {
  const body = document.body;
  body.setAttribute(
    "data-theme",
    body.getAttribute("data-theme") === "dark" ? "light" : "dark"
  );
}
