// components/LoadingSpinner.js
import React from "react";
import { motion } from "framer-motion";
import './styles/LoadingSpinner.css'

export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="rl-loading-wrapper">
      <motion.div
        className="rl-loading-spinner"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, ease: "linear", duration: 1 }}
      >
        <i className="fa fa-sync-alt"></i>
      </motion.div>
      <p className="rl-loading-text">{message}</p>
    </div>
  );
}