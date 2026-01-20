const API = "https://firstliveweb.onrender.com";

/* DOM */
const authBox = document.getElementById("authBox");
const todoBox = document.getElementById("todoBox");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

const authTitle = document.getElementById("authTitle");

let isLogin = true;
let token = localStorage.getItem("token");

document.getElementById("dateText").innerText =
  new Date().toDateString();

/* AUTO LOGIN */
if (token) showTodos();

/* AUTH */
function toggleAuth() {
  isLogin = !isLogin;
  authTitle.innerText = isLogin ? "🔐 Login" : "📝 Register";
  document.querySelector(".auth-box button").innerText =
    isLogin ? "Login" : "Register";
  document.querySelector(".auth-box p").innerText =
    isLogin ? "Create account" : "Back to login";
}

async function login() {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  if (!email || !password) return alert("Fill all fields");

  const url = isLogin
    ? "/api/users/login"
    : "/api/users/register";

  const res = await fetch(API + url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (!res.ok) return alert(data.msg || "Error");

  if (!isLogin) {
    alert("Account created. Login now.");
    toggleAuth();
    return;
  }

  token = data.token;
  localStorage.setItem("token", token);
  showTodos();
}

function logout() {
  localStorage.removeItem("token");
  location.reload();
}

/* TODOS */
function showTodos() {
  authBox.classList.add("hidden");
  todoBox.classList.remove("hidden");
  loadTodos();
}

async function loadTodos() {
  const res = await fetch(API + "/api/todos", {
    headers: { Authorization: "Bearer " + token }
  });

  const todos = await res.json();
  taskList.innerHTML = "";

  todos.forEach(t => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${t.text}</span>
      <button onclick="deleteTodo('${t._id}')">❌</button>
    `;
    taskList.appendChild(li);
  });
}

async function addTodo() {
  const text = taskInput.value.trim();
  if (!text) return;

  await fetch(API + "/api/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({ text })
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
