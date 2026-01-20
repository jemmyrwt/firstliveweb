const API = "https://firstliveweb.onrender.com";

/* ================= DOM ================= */
const authBox = document.getElementById("authBox");
const todoBox = document.getElementById("todoBox");
const todoList = document.getElementById("taskList");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const nameInput = document.getElementById("name");
const taskInput = document.getElementById("taskInput");

const authTitle = document.getElementById("authTitle");
const authBtn = document.getElementById("authBtn");

/* ================= STATE ================= */
let token = localStorage.getItem("token");
let isLogin = true;

/* ================= AUTO LOGIN ================= */
if (token) {
  showTodos();
}

/* ================= TOGGLE LOGIN / REGISTER ================= */
function toggleAuth() {
  isLogin = !isLogin;

  authTitle.innerText = isLogin ? "🔐 Login" : "📝 Register";
  authBtn.innerText = isLogin ? "Login" : "Register";

  // ✅ name field sirf register me dikhe
  nameInput.classList.toggle("hidden", isLogin);
}

/* ================= LOGIN / REGISTER ================= */
async function login() {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const name = nameInput.value.trim();

  if (!email || !password || (!isLogin && !name)) {
    alert("All fields required");
    return;
  }

  const url = isLogin
    ? API + "/api/users/login"
    : API + "/api/users/register";

  const body = isLogin
    ? { email, password }
    : { name, email, password };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.msg || "Error");
      return;
    }

    // ✅ Register success → login screen
    if (!isLogin) {
      alert("Account created successfully. Now login.");
      toggleAuth();
      return;
    }

    // ✅ Login success
    token = data.token;
    localStorage.setItem("token", token);
    localStorage.setItem("userName", data.user.name);

    showTodos();
  } catch (err) {
    alert("Server error");
  }
}

/* ================= TODOS ================= */
function showTodos() {
  authBox.classList.add("hidden");
  todoBox.classList.remove("hidden");

  document.getElementById("welcomeText").innerText =
    "Hello " + localStorage.getItem("userName") + " 👋";

  loadTodos();
}

async function loadTodos() {
  try {
    const res = await fetch(API + "/api/todos", {
      headers: { Authorization: "Bearer " + token }
    });

    if (!res.ok) {
      logout();
      return;
    }

    const todos = await res.json();
    todoList.innerHTML = "";

    todos.forEach(t => {
      const div = document.createElement("div");
      div.className = "task-card";
      div.innerHTML = `
        <span>${t.text}</span>
        <button onclick="deleteTodo('${t._id}')">❌</button>
      `;
      todoList.appendChild(div);
    });
  } catch {
    alert("Failed to load todos");
  }
}

async function addNewTask() {
  if (!taskInput.value.trim()) return;

  await fetch(API + "/api/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({ text: taskInput.value })
  });

  taskInput.value = "";
  loadTodos();
}

async function deleteTodo(id) {
  await fetch(API + "/api/todos/" + id, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token }
  });

  loadTodos();
}

function logout() {
  localStorage.clear();
  location.reload();
}
