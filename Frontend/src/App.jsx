import { useEffect, useState } from "react";

const API = "https://firstliveweb.onrender.com/api/todos";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");

  const loadTodos = async () => {
    const res = await fetch(API);
    setTodos(await res.json());
  };

  const addTodo = async () => {
    if (!text) return;
    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });
    setText("");
    loadTodos();
  };

  const deleteTodo = async (id) => {
    await fetch(API + "/" + id, { method: "DELETE" });
    loadTodos();
  };

  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <div className="app">
      <h1>🔥 Todo App</h1>

      <input
        placeholder="Add new task..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button onClick={addTodo}>Add Todo</button>

      {todos.map(todo => (
        <div className="todo" key={todo._id}>
          <span>{todo.text}</span>
          <button onClick={() => deleteTodo(todo._id)}>✕</button>
        </div>
      ))}
    </div>
  );
}
