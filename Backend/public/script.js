const API = "https://firstliveweb.onrender.com";

/* DOM */
const authBox = document.getElementById("authBox");
const todoBox = document.getElementById("todoBox");
const todoList = document.getElementById("taskList");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const nameInput = document.getElementById("name");
const taskInput = document.getElementById("taskInput");

let token = localStorage.getItem("token");
let isLogin = true;

if (token) showTodos();

/* TOGGLE LOGIN / REGISTER */
function toggleAuth() {
  isLogin = !isLogin;
  document.getElementById("authTitle").innerText =
    isLogin ? "🔐 Login" : "📝 Register";
  document.getElementById("authBtn").innerText =
    isLogin ? "Login" : "Register";
  nameInput.classList.toggle("hidden", isLogin);
}

/* LOGIN / REGISTER */
async function login() {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const name = nameInput.value.trim();

  const url = isLogin
    ? API + "/api/users/login"
    : API + "/api/users/register";

  const body = isLogin
    ? { email, password }
    : { name, email, password };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  if (!res.ok) return alert(data.msg);

  if (!isLogin) {
    alert("Account created, now login");
    toggleAuth();
    return;
  }

  token = data.token;
  localStorage.setItem("token", token);
  localStorage.setItem("userName", data.user.name);
  showTodos();
}

/* TODOS */
function showTodos() {
  authBox.classList.add("hidden");
  todoBox.classList.remove("hidden");
  document.getElementById("welcomeText").innerText =
    "Hello " + localStorage.getItem("userName") + " 👋";
  loadTodos();
}

async function loadTodos() {
  const res = await fetch(API + "/api/todos", {
    headers: { Authorization: "Bearer " + token }
  });
  const todos = await res.json();
  todoList.innerHTML = "";
  todos.forEach(t => {
    const div = document.createElement("div");
    div.innerHTML = `
      <div>${t.text} <button onclick="deleteTodo('${t._id}')">❌</button></div>
    `;
    todoList.appendChild(div);
  });
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
