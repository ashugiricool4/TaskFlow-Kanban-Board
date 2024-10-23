import React from "react";
import { useDrag, useDrop } from "react-dnd";
import "./TaskCard.css";

const priorityColors = {
  4: "#FF6347", // Urgent - red
  3: "#FFA500", // High - orange
  2: "#FFD700", // Medium - yellow
  1: "#32CD32", // Low - green
  0: "#D3D3D3", // No priority - gray
};

const TaskCard = ({ taskName, priority, moveTask, currentStatus }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "TASK",
    item: { taskName, currentStatus },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "TASK",
    drop: (item) => {
      if (item.currentStatus !== currentStatus) {
        moveTask(item.taskName, currentStatus);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`task-card ${isDragging ? "dragging" : ""} ${
        isOver ? "hover" : ""
      }`}
      style={{ borderLeft: `5px solid ${priorityColors[priority]}` }}
    >
      {taskName}
    </div>
  );
};

export default TaskCard;
