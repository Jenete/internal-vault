// components/SharedToaster.js
import React from "react";
import { motion } from "framer-motion";
import './styles/SharedToaster.css'

export default function SharedToaster({ message, type }) {
  return (
    <motion.div
      className={`toaster toaster-${type}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <i className={`fa fa-${type === "error" ? "exclamation-circle" : "check-circle"}`}></i> {message}
    </motion.div>
  );
}