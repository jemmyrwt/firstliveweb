const API = "https://firstliveweb.onrender.com";

/* ================= DOM ================= */
const authBox = document.getElementById("authBox");
const todoBox = document.getElementById("todoBox");
const todoList = document.getElementById("todoList");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const todoInput = document.getElementById("todoInput");

/* ================= STATE ================= */
let token = localStorage.getItem("token");
let isLogin = true;

/* ================= AUTO LOGIN ================= */
if (token) {
  showTodos();
}

/* ================= AUTH ================= */

function toggleAuth() {
  isLogin = !isLogin;

  document.querySelector("#authBox h2").innerText =
    isLogin ? "🔐 Login" : "📝 Create Account";

  document.querySelector("#authBox button").innerText =
    isLogin ? "Login" : "Register";

  document.querySelector("#authBox p").innerText =
    isLogin ? "Create account" : "Back to login";
}

async function login() {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    alert("Email & Password required");
    return;
  }

  const url = isLogin
    ? API + "/api/users/login"
    : API + "/api/users/register";

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.msg || "Error");
      return;
    }

    // Register mode
    if (!isLogin) {
      alert("Account created successfully. Now login.");
      toggleAuth();
      return;
    }

    // Login success
    token = data.token;
    localStorage.setItem("token", token);
    showTodos();
  } catch (err) {
    alert("Server error");
  }
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
  } catch (err) {
    alert("Failed to load todos");
  }
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
