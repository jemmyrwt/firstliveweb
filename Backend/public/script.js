/* ================= CONFIG ================= */
const API = "https://firstliveweb.onrender.com";
const token = localStorage.getItem("token");

/* ================= STATE ================= */
let tasks = [];
let timer = null;
let timeLeft = 1500;

/* ================= AUTH CHECK ================= */
if (!token) {
  alert("Please login first");
  window.location.href = "/";
}

/* ================= INIT ================= */
function init() {
  setupNavigation();
  updateClock();
  setInterval(updateClock, 1000);
  loadTasks();
}
init();

/* ================= CLOCK ================= */
function updateClock() {
  const clock = document.getElementById("live-clock");
  if (clock) {
    clock.innerText =
      new Date().toLocaleTimeString() +
      " | " +
      new Date().toDateString();
  }
}

/* ================= LOAD TODOS ================= */
async function loadTasks() {
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
    updateAnalytics();
  } catch (err) {
    alert("Failed to load tasks");
  }
}

/* ================= ADD TODO ================= */
document.getElementById("addBtn").addEventListener("click", async () => {
  const title = document.getElementById("taskTitle").value;
  const prio = document.getElementById("prioVal").value;
  const cat = document.getElementById("catVal").value;
  const date = document.getElementById("dateVal").value;

  if (!title.trim()) return;

  await fetch(API + "/api/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({
      title,
      prio,
      cat,
      date
    })
  });

  document.getElementById("taskTitle").value = "";
  loadTasks();
});

/* ================= TOGGLE TODO ================= */
async function toggleTask(id) {
  await fetch(API + "/api/todos/" + id, {
    method: "PATCH",
    headers: {
      Authorization: "Bearer " + token
    }
  });

  loadTasks();
}

/* ================= DELETE TODO ================= */
async function deleteTask(id) {
  await fetch(API + "/api/todos/" + id, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token
    }
  });

  loadTasks();
}

/* ================= RENDER TASKS ================= */
function renderTasks() {
  const grid = document.getElementById("taskGrid");
  if (!grid) return;

  grid.innerHTML = "";

  tasks.forEach(t => {
    const div = document.createElement("div");
    div.className = "task-card";

    div.innerHTML = `
      <div onclick="toggleTask('${t._id}')" style="cursor:pointer">
        <i class="${
          t.done ? "fas fa-check-circle" : "far fa-circle"
        }" style="font-size:1.5rem; color:${
      t.done ? "#2ed573" : "#6366f1"
    }"></i>
      </div>

      <div style="flex:1">
        <h4 style="${
          t.done ? "text-decoration:line-through; opacity:0.5" : ""
        }">${t.title}</h4>

        <div style="margin-top:5px">
          <span class="prio-tag prio-${t.prio}">${t.prio}</span>
          <small style="color:var(--text-s); margin-left:10px">
            #${t.cat} | ${t.date || "No Deadline"}
          </small>
        </div>
      </div>

      <i class="fas fa-trash-alt"
         style="color:var(--danger); cursor:pointer"
         onclick="deleteTask('${t._id}')"></i>
    `;

    grid.appendChild(div);
  });
}

/* ================= ANALYTICS ================= */
function updateAnalytics() {
  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  const totalEl = document.getElementById("stat-total");
  const effEl = document.getElementById("stat-efficiency");
  const ringText = document.getElementById("ring-pct");
  const ring = document.getElementById("ring");

  if (totalEl) totalEl.innerText = total;
  if (effEl) effEl.innerText = pct + "%";
  if (ringText) ringText.innerText = pct + "%";

  if (ring) {
    const offset = 377 - (377 * pct) / 100;
    ring.style.strokeDashoffset = offset;
  }
}

/* ================= NAVIGATION ================= */
function setupNavigation() {
  const navs = document.querySelectorAll(".nav-btn, .m-nav-item");

  navs.forEach(btn => {
    btn.addEventListener("click", () => {
      const viewId = btn.getAttribute("data-view");

      document.querySelectorAll(".view").forEach(v =>
        v.classList.remove("active")
      );

      document.getElementById("view-" + viewId)?.classList.add("active");

      navs.forEach(n => n.classList.remove("active"));
      btn.classList.add("active");

      if (viewId === "analytics") updateAnalytics();
    });
  });
}

/* ================= FOCUS TIMER ================= */
document.getElementById("timer-start")?.addEventListener("click", function () {
  if (timer) {
    clearInterval(timer);
    timer = null;
    this.innerText = "Start Focus";
    return;
  }

  timer = setInterval(() => {
    timeLeft--;
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    document.getElementById("timer-display").innerText =
      `${m}:${s < 10 ? "0" : ""}${s}`;

    if (timeLeft === 0) {
      clearInterval(timer);
      timer = null;
    }
  }, 1000);

  this.innerText = "Pause Session";
});

document.getElementById("timer-reset")?.addEventListener("click", () => {
  clearInterval(timer);
  timer = null;
  timeLeft = 1500;
  document.getElementById("timer-display").innerText = "25:00";
});

/* ================= THEME ================= */
function toggleTheme() {
  const body = document.body;
  const isDark = body.getAttribute("data-theme") === "dark";
  body.setAttribute("data-theme", isDark ? "light" : "dark");
}

/* ================= LOGOUT ================= */
function logout() {
  localStorage.clear();
  window.location.href = "/";
}
