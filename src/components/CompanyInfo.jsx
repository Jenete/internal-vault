import React, { useEffect, useState } from "react";
import {
  addCompanyInfo,
  getCompanyInfo,
  deleteCompanyInfo,
  updateCompanyInfo,
} from "../controllers/CompanyInfoController";
import { motion } from "framer-motion";
import LoadingSpinner from "./LoadingSpinner";
import SharedToaster from "./SharedToaster";
import "./styles/CompanyInfo.css";

export default function CompanyInfo() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ field: "", description: "" });
  const [status, setStatus] = useState(null);

  const currentUser = (() => {
    try {
      return JSON.parse(sessionStorage.getItem("internal-vault-user"))?.name || "Unknown";
    } catch {
      return "Unknown";
    }
  })();

  const fetchInfo = async () => {
    setLoading(true);
    const data = await getCompanyInfo();
    setFields(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        addedBy: currentUser,
        updatedAt: new Date().toISOString(),
      };
      if (editing) {
        await updateCompanyInfo(editing, payload);
        setStatus({ type: "success", message: "Field updated." });
      } else {
        await addCompanyInfo(payload);
        setStatus({ type: "success", message: "Field added." });
      }
      setForm({ field: "", description: "" });
      setEditing(null);
      fetchInfo();
    } catch {
      setStatus({ type: "error", message: "Failed to save field." });
    }
  };

  const handleEdit = (entry) => {
    setForm({ field: entry.field, description: entry.description });
    setEditing(entry.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this field?")) return;
    await deleteCompanyInfo(id);
    fetchInfo();
  };

  return (
    <motion.div className="rl-company-info" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h3>
        <i className="fa fa-building"></i> Company Info & Credentials
      </h3>

      <form className="rl-company-form" onSubmit={handleSubmit}>
        <input
          name="field"
          value={form.field}
          onChange={(e) => setForm({ ...form, field: e.target.value })}
          placeholder="Field Name (e.g., Tax Number, Bank Details)"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Description or Content"
          required
        ></textarea>
        <button type="submit">
          <i className={`fa ${editing ? "fa-edit" : "fa-plus"}`}></i> {editing ? "Update" : "Add"}
        </button>
      </form>

      {status && <SharedToaster message={status.message} type={status.type} />}

      {loading ? (
        <LoadingSpinner message="Loading company info..." />
      ) : (
        <div className="rl-company-list">
          {fields.map((entry) => (
            <div className="company-card" key={entry.id}>
              <h4>{entry.field}</h4>
              <p>{entry.description}</p>
              <small>
                Added by: <strong>{entry.addedBy}</strong>
                <br />
                Updated: {new Date(Number(entry.updatedAt.seconds) * 1000).toLocaleString()}
              </small>
              <div className="company-actions">
                <button onClick={() => handleEdit(entry)}><i className="fa fa-edit"></i></button>
                <button onClick={() => handleDelete(entry.id)}><i className="fa fa-trash"></i></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
