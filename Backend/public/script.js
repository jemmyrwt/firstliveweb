const API = "https://firstliveweb.onrender.com";
let token = localStorage.getItem("token");

const authBox = document.getElementById("authBox");
const todoBox = document.getElementById("todoBox");
const todoList = document.getElementById("todoList");

if (token) showTodos();

function toggleAuth() {
  alert("Register API use karo (same as login, POST /register)");
}

async function login() {
  const email = email.value;
  const password = password.value;

  const res = await fetch(API + "/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  token = data.token;
  localStorage.setItem("token", token);
  showTodos();
}

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
  todoList.innerHTML = "";
  todos.forEach(t => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${t.text}</span>
      <button onclick="delTodo('${t._id}')">❌</button>`;
    todoList.appendChild(li);
  });
}

async function addTodo() {
  const text = todoInput.value;
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

async function delTodo(id) {
  await fetch(API + "/api/todos/" + id, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token }
  });
  loadTodos();
}

function logout() {
  localStorage.removeItem("token");
  location.reload();
}
