import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles/UserAvatar.css"; // custom styles

export default function UserAvatar({ user }) {
  const navigate = useNavigate();

  if (!user) return null;

  const initials = user.name?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className="rl-user-avatar"
      title={user.name}
      onClick={() => navigate("/profile")}
    >
      {initials}
    </div>
  );
}
