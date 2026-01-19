import { useEffect, useState } from "react";


const API = "https://firstliveweb.onrender.com/api/users";

export default function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const loadUsers = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setUsers(data);
  };

  const addUser = async () => {
    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email })
    });
    setName("");
    setEmail("");
    loadUsers();
  };

  const deleteUser = async (id) => {
    await fetch(API + "/" + id, { method: "DELETE" });
    loadUsers();
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4 text-center">
          User Manager
        </h1>

        <input
          className="w-full border p-2 mb-2 rounded"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full border p-2 mb-2 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={addUser}
          className="w-full bg-blue-600 text-white p-2 rounded mb-4"
        >
          Add User
        </button>

        {users.map((u) => (
          <div
            key={u._id}
            className="flex justify-between items-center bg-gray-50 p-2 mb-2 rounded"
          >
            <div>
              <p className="font-semibold">{u.name}</p>
              <p className="text-sm text-gray-500">{u.email}</p>
            </div>
            <button
              onClick={() => deleteUser(u._id)}
              className="text-red-500"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
