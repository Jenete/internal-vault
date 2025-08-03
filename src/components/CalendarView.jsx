import React, { useEffect, useState } from "react";
import { getTasksByDateRange } from "../controllers/CalendarController";
import { motion } from "framer-motion";
import LoadingSpinner from "./LoadingSpinner";
import "./styles/CalendarView.css";
import AvailabilityScheduler from "./AvailabilityScheduler";
import RLCalendar from "./RLCalendar";

export default function CalendarView({ start, end }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTasks() {
      setLoading(true);
      const data = await getTasksByDateRange(start, end);
      setTasks(data);
      setLoading(false);
    }
    fetchTasks();
  }, [start, end]);

  if (loading) return <LoadingSpinner message="Fetching calendar tasks..." />;

  return (
    <motion.div className="rl-calendar-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <AvailabilityScheduler/>
      
      <RLCalendar tasks={tasks}/>
      <h4><i className="fa fa-calendar"></i> Tasks between {start} and {end}</h4>
      <ul className="rl-calendar-list">
        {tasks.map((task) => (
          <li key={task.id}>
            <i className="fa fa-tasks"></i> <strong>{task.title}</strong> — Due: {task.dueDate}
          </li>
        ))}
      </ul>

      

    </motion.div>
  );
}
