// components/FloatingNotification.js
import React, { useState } from "react";
import NotificationModal from "./NotificationModal";
import useNotifications from "../hooks/useNotifications";
import './styles/Notifications.css';

export default function FloatingNotification({ userId }) {
  const { notifications } = useNotifications(userId);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <div className="rl-floating-notification" onClick={() => setOpen(true)}>
        <i className="fa fa-bell"></i>
        {unreadCount > 0 && <span className="rl-notif-badge">{unreadCount}</span>}
      </div>
      {open && <NotificationModal notifications={notifications} onClose={() => setOpen(false)} />}
    </>
  );
}
