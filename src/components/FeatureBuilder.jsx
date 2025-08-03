import React, { useState, useEffect } from "react";
import {
  addFeature,
  getFeatures,
  updateFeature,
  deleteFeature,
} from "../controllers/FeatureBuilderController";
import { motion } from "framer-motion";
import LoadingSpinner from "./LoadingSpinner";
import SharedToaster from "./SharedToaster";
import "./styles/FeatureBuilder.css";

export default function FeatureBuilder() {
  const [features, setFeatures] = useState([]);
  const [editingId, setEditingId] = useState(null); // NEW
  const [form, setForm] = useState({
    name: "",
    description: "",
    progress: 0,
    links: "",
    assignedTo: "",
    media: "",
    startedAt: "",
    subFeatures: "",
  });

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    const data = await getFeatures();
    setFeatures(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleEdit = (feature) => {
    setForm({
      name: feature.name || "",
      description: feature.description || "",
      progress: feature.progress || 0,
      links: feature.links || "",
      assignedTo: (feature.assignedTo || []).join(", "),
      media: (feature.media || []).join(", "),
      startedAt: feature.startedAt || "",
      subFeatures:JSON.stringify(feature.subFeatures),
    });
    setEditingId(feature.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        assignedTo: form.assignedTo.split(",").map((s) => s.trim()),
        media: form.media.split(",").map((s) => s.trim()),
        subFeatures: editingId? JSON.parse(form.subFeatures):form.subFeatures.split(",").map((s) => ({name: s.trim(), status:'todo'})),
      };

      if (editingId) {
        await updateFeature(editingId, payload);
        setStatus({ type: "success", message: "Feature updated successfully!" });
      } else {
        await addFeature(payload);
        setStatus({ type: "success", message: "Feature added successfully!" });
      }

      setForm({
        name: "",
        description: "",
        progress: 0,
        links: "",
        assignedTo: "",
        media: "",
        startedAt: "",
        subFeatures: [],
      });
      setEditingId(null);
      fetchData();
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: "Error saving feature." });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this feature?")) return;
    await deleteFeature(id);
    fetchData();
  };

  const handleToggleSubFeature = async (featureId, index) => {
    const feature = features.find((f) => f.id === featureId);
    if (!feature) return;
    const updated = [...feature.subFeatures];
    updated[index].status = updated[index].status === "done" ? "todo" : "done";

    const progress =
      (updated.filter((sf) => sf.status === "done").length / updated.length) * 100;

    await updateFeature(featureId, { subFeatures: updated, progress });
    fetchData();
  };

  return (
    <motion.div className="rl-feature-builder" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h3><i className="fa fa-cogs"></i> Feature Builder</h3>

      <form className="rl-feature-form" onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Feature Name" required />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" required />
        <input type="number" name="progress" value={form.progress} onChange={handleChange} placeholder="Progress (0–100)" min="0" max="100" />
        <input name="assignedTo" value={form.assignedTo} onChange={handleChange} placeholder="Assigned To (comma-separated)" />
        <input name="subFeatures" value={form.subFeatures} onChange={handleChange} placeholder="Sub-features (comma-separated)" />
        <input name="links" value={form.links} onChange={handleChange} placeholder="Relevant Links (comma-separated)" />
        <input name="media" value={form.media} onChange={handleChange} placeholder="Image URLs (comma-separated)" />
        <input name="startedAt" value={form.startedAt} onChange={handleChange} placeholder="Start Date (e.g., 2025-08-01)" />
        <button type="submit">
          <i className={`fa ${editingId ? "fa-save" : "fa-plus"}`}></i> {editingId ? "Update Feature" : "Add Feature"}
        </button>
      </form>

      {status && <SharedToaster message={status.message} type={status.type} />}

      {loading ? (
        <LoadingSpinner message="Loading features..." />
      ) : (
        <div className="rl-feature-list">
          {features.map((f) => (
            <div className="feature-card" key={f.id}>
              <div className="feature-header">
                <h4>{f.name}</h4>
                <div>
                  <button onClick={() => handleEdit(f)}><i className="fa fa-edit"></i></button>
                  <button onClick={() => handleDelete(f.id)}><i className="fa fa-trash text-danger"></i></button>
                </div>
              </div>
              <p>{f.description}</p>
              <div className="progress-wrapper">
                <div className="progress-bar"><div className="progress-fill" style={{ width: `${f.progress}%` }}></div></div>
                <small>{f.progress}% complete</small>
              </div>
              <div className="meta">
                <p><i className="fa fa-calendar"></i> Started: {f.startedAt || "N/A"}</p>
                <p><i className="fa fa-user"></i> Assigned: {f.assignedTo?.join(", ") || "Unassigned"}</p>
                <p> {f.subFeatures?.length > 0 && (
                <div className="sub-features">
                  <h5>Sub-features</h5>
                  <ul>
                    {f.subFeatures.map((sf, i) => (
                      <li key={i}>
                        <label>
                          <input
                            type="checkbox"
                            checked={sf.status === "done"}
                            onChange={() => handleToggleSubFeature(f.id, i)}
                          />{" "}
                          {sf.name}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              )}</p>
                <p><i className="fa fa-link"></i> {f.links}</p>
                {f.media?.length > 0 && (
                  <div className="media-grid">
                    {f.media.map((src, i) => (
                      <img key={i} src={src} alt="feature media" />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
