let todos = [];
let filter = "all";

const input = document.getElementById("taskInput");
const list = document.getElementById("todoList");
const count = document.getElementById("count");

function addTodo(){
  const text = input.value.trim();
  if(!text) return;

  todos.push({
    id:Date.now(),
    text,
    done:false
  });

  input.value="";
  render();
}

function toggle(id){
  todos = todos.map(t =>
    t.id===id ? {...t,done:!t.done} : t
  );
  render();
}

function del(id){
  todos = todos.filter(t=>t.id!==id);
  render();
}

function clearDone(){
  todos = todos.filter(t=>!t.done);
  render();
}

function filterTodos(f){
  filter=f;
  document.querySelectorAll(".filters button")
    .forEach(b=>b.classList.remove("active"));
  event.target.classList.add("active");
  render();
}

function render(){
  list.innerHTML="";

  let filtered = todos;
  if(filter==="active") filtered=todos.filter(t=>!t.done);
  if(filter==="done") filtered=todos.filter(t=>t.done);

  filtered.forEach(t=>{
    const li=document.createElement("li");
    if(t.done) li.classList.add("done");

    li.innerHTML=`
      <span onclick="toggle(${t.id})">${t.text}</span>
      <button onclick="del(${t.id})">✕</button>
    `;
    list.appendChild(li);
  });

  count.innerText = `${todos.length} tasks`;
}
