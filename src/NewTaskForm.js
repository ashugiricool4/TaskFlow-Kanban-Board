import React, { useState } from "react";
import "./NewTaskForm.css";

const NewTaskForm = ({ addTask }) => {
  const [taskName, setTaskName] = useState("");
  const [priority, setPriority] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskName.trim()) {
      addTask(taskName, priority);
      setTaskName("");
      setPriority(0);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="new-task-form">
      <input
        type="text"
        placeholder="New task name"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
      />
      <select value={priority} onChange={(e) => setPriority(+e.target.value)}>
        <option value={0}>No Priority</option>
        <option value={1}>Low</option>
        <option value={2}>Medium</option>
        <option value={3}>High</option>
        <option value={4}>Urgent</option>
      </select>
      <button type="submit">Add Task</button>
    </form>
  );
};

export default NewTaskForm;
