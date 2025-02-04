"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [editedTaskTitle, setEditedTaskTitle] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }, []);

  const addTask = async () => {
    const newTask = { title: task };
    const res = await fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    });
    const createdTask = await res.json();
    setTasks([...tasks, createdTask]);
    setTask("");
  };

  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, { method: "DELETE" });
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const startEdit = (task) => {
    setEditingTask(task.id);
    setEditedTaskTitle(task.title);
  };

  const updateTask = async () => {
    const updatedTask = { title: editedTaskTitle };
    await fetch(`http://localhost:5000/tasks/${editingTask}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask),
    });
    setTasks(tasks.map(t => (t.id === editingTask ? { ...t, title: editedTaskTitle } : t)));
    setEditingTask(null);
    setEditedTaskTitle("");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-4">Task Manager</h1>
      <div className="flex gap-2 mb-4">
        <input 
          value={task} 
          onChange={(e) => setTask(e.target.value)} 
          placeholder="New task" 
          className="p-2 border rounded-lg w-60"
        />
        <button 
          onClick={addTask} 
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Add Task
        </button>
      </div>
      <ul className="w-full max-w-md bg-white p-4 rounded-lg shadow-md">
        {tasks.map((t) => (
          <li 
            key={t.id} 
            className="flex justify-between items-center p-2 border-b last:border-b-0"
          >
            {editingTask === t.id ? (
              <input
                value={editedTaskTitle}
                onChange={(e) => setEditedTaskTitle(e.target.value)}
                className="p-1 border rounded-lg w-40"
              />
            ) : (
              <span className="text-lg">{t.title}</span>
            )}
            <div className="flex gap-2">
              {editingTask === t.id ? (
                <button 
                  onClick={updateTask} 
                  className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                >
                  Save
                </button>
              ) : (
                <button 
                  onClick={() => startEdit(t)} 
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
              )}
              <button 
                onClick={() => deleteTask(t.id)} 
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}