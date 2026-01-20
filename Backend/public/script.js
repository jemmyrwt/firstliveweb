const API = "https://firstliveweb.onrender.com";

/* DOM */
const authBox = document.getElementById("authBox");
const todoBox = document.getElementById("todoBox");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const nameInput = document.getElementById("name");
const taskInput = document.getElementById("taskInput");

const authTitle = document.getElementById("authTitle");
const authBtn = document.getElementById("authBtn");
const toggleText = document.getElementById("toggleText");
const taskList = document.getElementById("taskList");

let isLogin = true;
let token = localStorage.getItem("token");

/* AUTO LOGIN */
if (token) showTodos();

/* TOAST */
function showToast(msg, type="success") {
  const t = document.createElement("div");
  t.className = `toast ${type}`;
  t.innerText = msg;
  document.body.appendChild(t);
  setTimeout(()=>t.remove(),2500);
}

/* TOGGLE */
function toggleAuth() {
  isLogin = !isLogin;
  authTitle.innerText = isLogin ? "🔐 Login" : "📝 Register";
  authBtn.innerText = isLogin ? "Login" : "Register";
  toggleText.innerText = isLogin ? "Create account" : "Back to login";
  nameInput.classList.toggle("hidden", isLogin);
}

/* SHOW/HIDE PASSWORD */
function togglePassword() {
  passwordInput.type =
    passwordInput.type === "password" ? "text" : "password";
}

/* LOGIN / REGISTER */
async function login() {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const name = nameInput.value.trim();

  if (!email || !password || (!isLogin && !name)) {
    showToast("All fields required","error");
    return;
  }

  const url = isLogin
    ? API + "/api/users/login"
    : API + "/api/users/register";

  const body = isLogin
    ? { email, password }
    : { name, email, password };

  const res = await fetch(url,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  if (!res.ok) {
    showToast(data.msg,"error");
    return;
  }

  if (!isLogin) {
    showToast("Account created 🎉");
    toggleAuth();
    return;
  }

  localStorage.setItem("token",data.token);
  localStorage.setItem("userName",data.user.name);
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
  const res = await fetch(API+"/api/todos",{
    headers:{ Authorization:"Bearer "+localStorage.getItem("token") }
  });
  const todos = await res.json();
  taskList.innerHTML = "";
  todos.forEach(t=>{
    const li=document.createElement("li");
    li.innerHTML=`${t.text} <button onclick="deleteTodo('${t._id}')">❌</button>`;
    taskList.appendChild(li);
  });
}

async function addNewTask() {
  if (!taskInput.value.trim()) return;
  await fetch(API+"/api/todos",{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      Authorization:"Bearer "+localStorage.getItem("token")
    },
    body:JSON.stringify({text:taskInput.value})
  });
  taskInput.value="";
  loadTodos();
}

async function deleteTodo(id) {
  await fetch(API+"/api/todos/"+id,{
    method:"DELETE",
    headers:{ Authorization:"Bearer "+localStorage.getItem("token") }
  });
  loadTodos();
}

function logout() {
  localStorage.clear();
  location.reload();
}
