import { useState } from "react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    const res = await fetch(
      "https://firstliveweb.onrender.com/api/users/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      }
    );

    const data = await res.json();
    alert(data.message || "User Created");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form
        onSubmit={submitHandler}
        className="bg-white p-6 rounded w-80"
      >
        <h2 className="text-xl mb-4 font-bold">Register</h2>

        <input
          className="border p-2 mb-2 w-full"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="border p-2 mb-2 w-full"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border p-2 mb-4 w-full"
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="bg-black text-white w-full py-2">
          Register
        </button>
      </form>
    </div>
  );
}
