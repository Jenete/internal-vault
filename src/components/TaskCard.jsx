import React, { useState } from "react";

export default function TaskCard({ task, onDelete, onUpdate, people }) {
  const [edited, setEdited] = useState({ ...task });

  const handleChange = (field, value) => {
    setEdited(prev => ({ ...prev, [field]: value }));
  };

  const handleBlur = () => {
    if (JSON.stringify(edited) !== JSON.stringify(task)) {
      onUpdate(edited.id, edited);
    }
  };

  return (
    <div className="rl-task-card">
      <div className="rl-task-header">
        <input
          className="rl-task-input"
          value={edited.title}
          onChange={(e) => handleChange("title", e.target.value)}
          onBlur={handleBlur}
        />
        <button onClick={onDelete} title="Delete Task">
          <i className="fa fa-trash"></i>
        </button>
      </div>

      <textarea
        className="rl-task-description"
        value={edited.description}
        onChange={(e) => handleChange("description", e.target.value)}
        onBlur={handleBlur}
      />

      <div className="rl-task-meta">
        <select
          className="rl-task-select"
          value={edited.assignee}
          onChange={(e) => handleChange("assignee", e.target.value)}
          onBlur={handleBlur}
        >
          {people.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>

        <select
          className="rl-task-select"
          value={edited.status}
          onChange={(e) => handleChange("status", e.target.value)}
          onBlur={handleBlur}
        >
          {["Backlog", "To Do", "In Progress", "Done"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <input
          type="date"
          className="rl-task-select"
          value={edited.dueDate || ""}
          onChange={(e) => handleChange("dueDate", e.target.value)}
          onBlur={handleBlur}
        />
      </div>
    </div>
  );
}
