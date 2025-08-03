// components/NotificationModal.js
import React from "react";
import { motion } from "framer-motion";
import { markNotificationAsRead } from "../controllers/NotificationController";
import './styles/Notifications.css';

export default function NotificationModal({ notifications, onClose }) {
  const handleRead = async (id) => {
    await markNotificationAsRead(id);
  };

  return (
    <motion.div className="rl-notif-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div className="rl-notif-modal" initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <div className="rl-notif-modal-header">
          <h4><i className="fa fa-bell"></i> Notifications</h4>
          <button onClick={onClose}><i className="fa fa-times"></i></button>
        </div>
        <ul className="rl-notif-list">
          {notifications.length === 0 ? (
            <li className="rl-notif-empty">No notifications</li>
          ) : (
            notifications.map((n) => (
              <li key={n.id} className={`rl-notif-item ${n.read ? "read" : "unread"}`}>
                <p>{n.message}</p>
                <small>{new Date(n.timestamp?.toDate()).toLocaleString()}</small>
                {!n.read && (
                  <button onClick={() => handleRead(n.id)}><i className="fa fa-check-circle"></i> Mark Read</button>
                )}
              </li>
            ))
          )}
        </ul>
      </motion.div>
    </motion.div>
  );
}
