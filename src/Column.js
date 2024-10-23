import React from "react";
import TaskCard from "./TaskCard";

const Column = ({ status, tasks, moveTask }) => {
  return (
    <div className="column">
      <h2>{status}</h2>
      {tasks.length === 0 ? (
        <p>No tasks available</p>
      ) : (
        tasks.map((task) => (
          <TaskCard
            key={task.title}
            taskName={task.title}
            priority={task.priority}
            moveTask={moveTask}
            currentStatus={status}
          />
        ))
      )}
    </div>
  );
};

export default Column;
