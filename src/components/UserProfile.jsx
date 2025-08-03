import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "../controllers/firebaseConfig";
import LoadingSpinner from "./LoadingSpinner";
import SharedToaster from "./SharedToaster";
import { motion } from "framer-motion";
import "./styles/UserProfile.css";

export default function UserProfile({ user }) {
  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState("");
  const [type, setType] = useState("success");
  const [saving, setSaving] = useState(false);

  let currentUser = user;
  try {
    currentUser = JSON.parse(sessionStorage.getItem("internal-vault-user")) || user;
  } catch (err) {
    console.error(err);
  }

  useEffect(() => {
    if (!currentUser?.uid) return;

    const loadProfile = async () => {
      const ref = doc(db, "users", currentUser.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setProfile(snap.data());
      } else {
        setProfile({
          name: currentUser.name || "",
          nickname: currentUser.nickname || "",
          role: currentUser.role || "",
          photoURL: currentUser.photoURL || "",
        });
      }
    };

    loadProfile();
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!currentUser?.uid) return;

    const ref = doc(db, "users", currentUser.uid);
    try {
      setSaving(true);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        await updateDoc(ref, profile);
      } else {
        await setDoc(ref, profile);
      }
      setStatus("Profile saved successfully!");
      setType("success");
    } catch (err) {
      console.error("Save error:", err);
      setStatus("Failed to save profile.");
      setType("error");
    } finally {
      setSaving(false);
    }
  };

  if (!profile) return <LoadingSpinner message="Loading profile..." />;

  return (
    <motion.div className="rl-user-profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2><i className="fa fa-user-circle"></i> Profile</h2>

      <div className="rl-profile-photo">
        <img
          src={
            profile.photoURL ||
            "https://png.pngtree.com/png-clipart/20190705/original/pngtree-cartoon-smiling-boys-back-png-image_4280383.jpg"
          }
          alt="Profile"
        />
      </div>

      <div className="rl-profile-form">
        <input
          name="name"
          placeholder="Full Name"
          value={profile.name || ""}
          onChange={handleChange}
        />
        <input
          name="nickname"
          placeholder="Nickname"
          value={profile.nickname || ""}
          onChange={handleChange}
        />
        <input
          name="role"
          placeholder="Role"
          value={profile.role || ""}
          onChange={handleChange}
        />
        <input
          name="photoURL"
          placeholder="Profile Image URL"
          value={profile.photoURL || ""}
          onChange={handleChange}
        />
        <button onClick={handleSave} disabled={saving}>
          <i className="fa fa-save"></i> {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {status && <SharedToaster message={status} type={type} />}
    </motion.div>
  );
}
