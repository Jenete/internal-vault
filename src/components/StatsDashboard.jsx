import React, { useEffect, useState } from "react";
import { getStats } from "../controllers/StatsController";
import { motion } from "framer-motion";
import LoadingSpinner from "./LoadingSpinner";
import './styles/StatsDashboard.css';

export default function StatsDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      const data = await getStats();
      setStats(data);
      setLoading(false);
    }
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner message="Loading project statistics..." />;

  const total = stats.totalTasks || 1;

  return (
    <motion.div
      className="rl-stats-dashboard"
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <h3><i className="fa fa-chart-bar"></i> Project Statistics</h3>

      <div className="rl-stats-grid">
        <div className="rl-stats-card"><i className="fa fa-folder-open"></i> {stats.totalProjects} Projects</div>
        <div className="rl-stats-card"><i className="fa fa-tasks"></i> {stats.totalTasks} Tasks</div>
        <div className="rl-stats-card"><i className="fa fa-file"></i> {stats.totalDocuments} Documents</div>
      </div>

      <h4><i className="fa fa-stream"></i> Task Breakdown</h4>
      <ul className="rl-breakdown-list">
        <li><i className="fa fa-list"></i> Backlog: {stats.taskBreakdown.backlog}</li>
        <li><i className="fa fa-hourglass-start"></i> To Do: {stats.taskBreakdown.todo}</li>
        <li><i className="fa fa-spinner"></i> In Progress: {stats.taskBreakdown.inProgress}</li>
        <li><i className="fa fa-check-circle"></i> Done: {stats.taskBreakdown.done}</li>
        <li><i className="fa fa-exclamation-triangle text-danger"></i> Overdue: {stats.taskBreakdown.overdue}</li>
      </ul>

      <h4><i className="fa fa-users"></i> Work Distribution</h4>
      <div className="rl-assignee-progress">
        {Object.entries(stats.assigneeBreakdown).map(([name, count]) => {
          const percent = ((count / total) * 100).toFixed(1);
          return (
            <div key={name} className="rl-assignee-bar">
              <div className="rl-assignee-header">
                <span><i className="fa fa-user"></i> {name}</span>
                <span>{count} tasks ({percent}%)</span>
              </div>
              <div className="rl-progress-meter">
                <div className="rl-progress-fill" style={{ width: `${percent}%` }}></div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
