const API = "https://firstliveweb.onrender.com";

/* DOM */
const authScreen = document.getElementById("authScreen");
const appScreen  = document.getElementById("appScreen");

const emailEl = document.getElementById("email");
const passEl  = document.getElementById("password");
const nameEl  = document.getElementById("name");
const authBtn = document.getElementById("authBtn");
const authSub = document.getElementById("authSub");
const authSwitch = document.getElementById("authSwitch");

const taskInput = document.getElementById("taskTitle");
const taskGrid  = document.getElementById("taskGrid");

let isLogin = true;
let token = localStorage.getItem("token");

/* AUTO LOGIN */
if (token) openApp();

/* TOGGLE */
function toggleAuth() {
  isLogin = !isLogin;
  nameEl.classList.toggle("hidden", isLogin);
  authBtn.innerText = isLogin ? "Login" : "Register";
  authSub.innerText = isLogin ? "Login to continue" : "Create account";
  authSwitch.innerText = isLogin ? "Create new account" : "Back to login";
}

/* AUTH */
async function submitAuth() {
  const email = emailEl.value.trim();
  const password = passEl.value.trim();
  const name = nameEl.value.trim();

  const url = isLogin
    ? API + "/api/users/login"
    : API + "/api/users/register";

  const body = isLogin
    ? { email, password }
    : { name, email, password };

  const res = await fetch(url,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify(body)
  });

  const data = await res.json();
  if(!res.ok) return alert(data.msg);

  if(!isLogin){
    alert("Account created, login now");
    toggleAuth();
    return;
  }

  localStorage.setItem("token", data.token);
  localStorage.setItem("userName", data.user.name);
  openApp();
}

/* OPEN APP */
function openApp() {
  authScreen.classList.add("hidden");
  appScreen.classList.remove("hidden");
  document.getElementById("welcomeText").innerText =
    "Welcome " + localStorage.getItem("userName") + " 👋";
  loadTasks();
}

/* TASKS */
async function loadTasks() {
  const res = await fetch(API + "/api/todos",{
    headers:{ Authorization:"Bearer "+localStorage.getItem("token") }
  });
  const tasks = await res.json();
  taskGrid.innerHTML="";
  tasks.forEach(t=>{
    const div=document.createElement("div");
    div.className="task-card";
    div.innerHTML=`
      <span>${t.text}</span>
      <button onclick="deleteTask('${t._id}')">❌</button>
    `;
    taskGrid.appendChild(div);
  });
}

async function addTask() {
  if(!taskInput.value.trim()) return;
  await fetch(API + "/api/todos",{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      Authorization:"Bearer "+localStorage.getItem("token")
    },
    body:JSON.stringify({ text: taskInput.value })
  });
  taskInput.value="";
  loadTasks();
}

async function deleteTask(id) {
  await fetch(API + "/api/todos/"+id,{
    method:"DELETE",
    headers:{ Authorization:"Bearer "+localStorage.getItem("token") }
  });
  loadTasks();
}

function logout(){
  localStorage.clear();
  location.reload();
}
