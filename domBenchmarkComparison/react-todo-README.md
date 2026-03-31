React To-Do implementation (source only):

1) `src/App.js`:

import { useState, useMemo } from "react";

const initialTasks = [
  { id: 1, name: "Task A", priority: "High" },
  { id: 2, name: "Task B", priority: "Medium" },
];

function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [form, setForm] = useState({ id: null, name: "", priority: "Low" });

  const editTask = (task) => setForm(task);

  const addOrUpdate = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (form.id) {
      setTasks((prev) => prev.map((t) => (t.id === form.id ? { ...form } : t)));
    } else {
      setTasks((prev) => [...prev, { ...form, id: Date.now() }]);
    }
    setForm({ id: null, name: "", priority: "Low" });
  };

  const deleteTask = (id) => setTasks((prev) => prev.filter((t) => t.id !== id));

  const perf = useMemo(() => ({ total: tasks.length, high: tasks.filter((t) => t.priority === "High").length }), [tasks]);

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h1>React Todo</h1>
      <form onSubmit={addOrUpdate}>
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Task name" />
        <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <button type="submit">{form.id ? "Update" : "Add"}</button>
      </form>
      <p>Total: {perf.total} High: {perf.high}</p>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <strong>{task.name}</strong> ({task.priority})
            <button onClick={() => editTask(task)}>Edit</button>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

2) Use `npx create-react-app react-todo`, drop this `App.js`, and run `npm start`.

Benchmark in React: use Performance API from a component callback in `useEffect` with setTasks(size) and measure `performance.now()` before/after.
