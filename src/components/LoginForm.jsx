import React, { useState } from "react";
import { motion } from "framer-motion";
import SharedToaster from "./SharedToaster";
import LoadingSpinner from "./LoadingSpinner";
import { useNavigate } from "react-router-dom";
import {
  loginUser,
  registerUser,
  resetPassword,
} from "../auth/AuthController";
import "./styles/LoginForm.css";

export default function LoginForm({ onLogin }) {
  const [mode, setMode] = useState("login"); // 'login' | 'register' | 'reset'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAction = async (e) => {
    e.preventDefault();
    setError("");
    setToast(null);
    setLoading(true);

    try {
      if (mode === "login") {
        const user = await loginUser(email, password);
        onLogin(user);
        navigate("/");
      } else if (mode === "register") {
        if (password !== confirm) throw new Error("Passwords do not match");
        const user = await registerUser(email, password);
        onLogin(user);
        navigate("/");
      } else if (mode === "reset") {
        await resetPassword(email);
        setToast("Reset link sent to your email");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = (to) => {
    setMode(to);
    setEmail("");
    setPassword("");
    setConfirm("");
    setError("");
    setToast(null);
  };

  return (
    <motion.form
      onSubmit={handleAction}
      className="rl-login-form"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="rl-login-title">
        {mode === "login" && "🔐 Welcome Back"}
        {mode === "register" && "👋 Create an Account"}
        {mode === "reset" && "🔁 Reset Password"}
      </h2>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      {(mode === "login" || mode === "register") && (
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      )}

      {mode === "register" && (
        <input
          type="password"
          placeholder="Confirm password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
      )}

      <button type="submit" disabled={loading}>
        <i className={`fa fa-${mode === "login" ? "sign-in-alt" : mode === "register" ? "user-plus" : "redo"}`}></i>{" "}
        {loading
          ? mode === "login"
            ? "Logging in..."
            : mode === "register"
            ? "Creating account..."
            : "Sending reset link..."
          : mode === "login"
          ? "Login"
          : mode === "register"
          ? "Register"
          : "Reset Password"}
      </button>

      {loading && <LoadingSpinner message="Please wait..." />}
      {error && <SharedToaster message={error} type="error" />}
      {toast && <SharedToaster message={toast} type="success" />}

      <div className="rl-auth-switch">
        {mode !== "login" && (
          <span onClick={() => toggleMode("login")}>← Back to Login</span>
        )}
        {mode === "login" && (
          <>
            <span onClick={() => toggleMode("reset")}>Forgot Password?</span>
            <span onClick={() => toggleMode("register")}>New User? Register</span>
          </>
        )}
      </div>
    </motion.form>
  );
}
