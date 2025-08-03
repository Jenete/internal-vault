import React, { useEffect, useState } from "react";
import {
  getTasksByProject,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/TaskController";
import TaskCard from "./TaskCard";
import { motion } from "framer-motion";
import LoadingSpinner from "./LoadingSpinner";
import "./styles/ProjectBoard.css";

export default function ProjectBoard({ projectId }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newStatus, setNewStatus] = useState("Backlog");
  const [newAssign, setNewAssign] = useState("Backlog");
  const [newDueDate, setNewDueDate] = useState("Unassigned");
  const [disabledButton, setDisabledButton] = useState(false);
  let currentUser = 'contributor';
  try {
    currentUser = JSON.parse(sessionStorage.getItem('internal-vault-user')).nickname;
  } catch (error) {
    console.error(error);
  }

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const fetchTasks = async () => {
    setLoading(true);
    const projectTasks = await getTasksByProject(projectId);
    setTasks(projectTasks);
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    setDisabledButton(true);
    await createTask({
      title: newTitle,
      status: newStatus,
      description: newDescription,
      assignee: newAssign||"Unassigned",
      projectId,
      dueDate: newDueDate ||new Date().toISOString().split("T")[0],
      createdBy: currentUser,
    });
    setNewTitle("");
    setDisabledButton(false);
    await fetchTasks();
  };

  const handleDelete = async (id) => {
    await deleteTask(id, currentUser);
    await fetchTasks();
  };

  const handleStatusChange = async (id, newStatus) => {
    await updateTask(id, { status: newStatus });
    await fetchTasks();
  };

  const handleUpdate = async (id, updates) => {
    await updateTask(id, updates, currentUser);
    await fetchTasks();
  };    


  const columns = ["Backlog", "To Do", "In Progress", "Done"];
  const people = ["Mitch", "Sne", "Theo", "Jenete", "Unassigned"];

  if (loading) return <LoadingSpinner message="Fetching tasks..." />;

  return (
    <div className="rl-project-board">
      <div className="rl-task-create">
        <input
          type="text"
          placeholder="Task Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />

        <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
          {columns.map((col) => (
            <option key={col}>{col}</option>
          ))}
        </select>
        <select value={newAssign} onChange={(e) => setNewAssign(e.target.value)}>
          {people.map((col) => (
            <option key={col}>{col}</option>
          ))}
        </select>
          <input
            type="date"
            placeholder="Due date"
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)}
          />
        <button onClick={handleCreate} disabled={disabledButton}>
          <i className="fa fa-plus"></i> Add Task
        </button>
      </div>

      {columns.map((col) => (
        <motion.div className="rl-column" key={col} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h4>{col}</h4>
          {tasks
            .filter((t) => t.status === col)
            .map((task) => (
              <TaskCard
                  key={task.id}
                  task={task}
                  onDelete={() => handleDelete(task.id)}
                  onUpdate={handleUpdate}
                  people={people}
                />

            ))}
        </motion.div>
      ))}
    </div>
  );
}
