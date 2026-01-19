const API = "/api/users";

async function loadUsers() {
  const res = await fetch(API);
  const data = await res.json();

  const list = document.getElementById("users");
  list.innerHTML = "";

  data.forEach(u => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${u.name} <br><small>${u.email}</small></span>
      <span class="delete" onclick="deleteUser('${u._id}')">✖</span>
    `;
    list.appendChild(li);
  });
}

async function addUser() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;

  if (!name || !email) return alert("Fill all fields");

  await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email })
  });

  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  loadUsers();
}

async function deleteUser(id) {
  await fetch(API + "/" + id, { method: "DELETE" });
  loadUsers();
}

loadUsers();
