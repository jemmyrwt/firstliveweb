const API = "https://firstliveweb.onrender.com";

// DOM elements
const authBox = document.getElementById("authBox");
const todoBox = document.getElementById("todoBox");
const todoList = document.getElementById("todoList");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const todoInput = document.getElementById("todoInput");

let token = localStorage.getItem("token");

// auto login
if (token) {
  showTodos();
}

/* ================= AUTH ================= */

async function login() {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    alert("Email & Password required");
    return;
  }

  const res = await fetch(API + "/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.msg || "Login failed");
    return;
  }

  token = data.token;
  localStorage.setItem("token", token);
  showTodos();
}

async function register() {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  const res = await fetch(API + "/api/users/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  alert(data.msg || "Registered");
}

function logout() {
  localStorage.removeItem("token");
  location.reload();
}

/* ================= TODOS ================= */

function showTodos() {
  authBox.classList.add("hidden");
  todoBox.classList.remove("hidden");
  loadTodos();
}

async function loadTodos() {
  const res = await fetch(API + "/api/todos", {
    headers: {
      Authorization: "Bearer " + token
    }
  });

  if (!res.ok) {
    logout();
    return;
  }

  const todos = await res.json();
  todoList.innerHTML = "";

  todos.forEach(todo => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${todo.text}</span>
      <button onclick="deleteTodo('${todo._id}')">❌</button>
    `;
    todoList.appendChild(li);
  });
}

async function addTodo() {
  const text = todoInput.value.trim();
  if (!text) return;

  await fetch(API + "/api/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({ text })
  });

  todoInput.value = "";
  loadTodos();
}

async function deleteTodo(id) {
  await fetch(API + "/api/todos/" + id, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token
    }
  });
  loadTodos();
}
