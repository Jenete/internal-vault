import React, { useEffect, useState } from "react";
import {
  getRevenueStats,
  addRevenueEntry,
  approveRevenueEntry
} from "../controllers/RevenueController";
import { motion } from "framer-motion";
import LoadingSpinner from "./LoadingSpinner";
import SharedToaster from "./SharedToaster";
import "./styles/RevenueDashboard.css";

export default function RevenueDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  let currentUser = "";

  try {
    currentUser = JSON.parse(sessionStorage.getItem("internal-vault-user")).nickname;
  } catch (error) {
    console.error(error);
  }

  const [form, setForm] = useState({
    type: "income",
    amount: "",
    user: currentUser,
    reason: ""
  });

  const fetchStats = async () => {
    setLoading(true);
    const data = await getRevenueStats();
    setStats(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addRevenueEntry(form);
      setStatus({ type: "success", message: "Entry added successfully." });
      setForm({ type: "income", amount: "", user: currentUser, reason: "" });
      fetchStats();
    } catch {
      setStatus({ type: "error", message: "Failed to add entry." });
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveRevenueEntry(id);
      setStatus({ type: "success", message: "Entry approved." });
      fetchStats();
    } catch {
      setStatus({ type: "error", message: "Approval failed." });
    }
  };

  if (loading) return <LoadingSpinner message="Loading revenue data..." />;

  return (
    <motion.div className="rl-revenue-dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h3>
        Revenue Dashboard
      </h3>

      <div className="rl-revenue-summary">
        <div className="income"> Total Income: R{stats.totalIncome.toFixed(2)}</div>
        <div className="expense"> Expenses: R{stats.totalExpenses.toFixed(2)}</div>
        <div className="balance">Net Balance: R{stats.netBalance.toFixed(2)}</div>
      </div>

      <form className="rl-revenue-form" onSubmit={handleSubmit}>
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="user"
          placeholder="Your name"
          value={form.user}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="reason"
          placeholder="Reason / Description"
          value={form.reason}
          onChange={handleChange}
          required
        />
        <button type="submit">
          <i className="fa fa-plus"></i> Add Entry
        </button>
      </form>

      {status && <SharedToaster message={status.message} type={status.type} />}

      <div className="rl-revenue-breakdown">
        <h4><i className="fa fa-users"></i> User Contributions</h4>
        <ul>
          {Object.entries(stats.breakdown).map(([user, amount]) => (
            <li key={user}>
              <i className="fa fa-user"></i> {user}: R{amount.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>

      <div className="rl-revenue-entries">
        <h4><i className="fa fa-book"></i> Revenue Entries</h4>
        <table className="rl-revenue-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Reason</th>
              <th>Timestamp</th>
              <th>Approved</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {stats.entries.map((entry) => (
              <tr key={entry.id} className={entry.type === "income" ? "income-row" : "expense-row"}>
                <td>{entry.user}</td>
                <td>{entry.type}</td>
                <td>R{parseFloat(entry.amount).toFixed(2)}</td>
                <td>{entry.reason}</td>
                <td>{new Date(entry.timestamp?.toDate?.() || entry.timestamp).toLocaleString()}</td>
                <td>{entry.approved ? "✅" : "❌"}</td>
                <td>
                  {!entry.approved && (
                    <button className="approve-btn" onClick={() => handleApprove(entry.id)}>
                      <i className="fa fa-check"></i> Approve
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
