// components/HomePage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./styles/HomePage.css";
import FloatingNotification from "./FloatingNotification";
import UserAvatar from "./UserAvatar";
import VaultHeader from "./VaultHeader";

const cardData = [
  {
    title: "Dashboard",
    icon: "chart-line",
    description: "View project statistics and overall progress.",
    link: "/dashboard"
  },
  {
    title: "Boards",
    icon: "columns",
    description: "Manage tasks across different project boards.",
    link: "/board/demo-project"
  },
  {
    title: "Documents",
    icon: "file-alt",
    description: "Upload and access shared project files.",
    link: "/documents/demo-project"
  },
  {
    title: "Revenue",
    icon: "credit-card",
    description: "Manage finances",
    link: "/revenue/demo-project"
  },
  {
    title: "Features",
    icon: "rocket",
    description: "View and add features",
    link: "/feature/demo-project"
  },
  {
    title: "Company",
    icon: "building",
    description: "Add company details",
    link: "/company/demo-project"
  },
  {
    title: "Calendar",
    icon: "calendar",
    description: "View and track tasks by due date.",
    link: "/calendar"
  }
];

export default function HomePage({user}) {
  const navigate = useNavigate();

  return (
    <div className="rl-homepage">
      <VaultHeader/>
      <p className="vault-subtitle"><h1>Welcome back {user?.nickname}! Let's build!</h1></p>

      <div className="rl-card-grid">
        {cardData.map((card, index) => (
          <motion.div
            className="rl-home-card"
            key={index}
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate(card.link)}
          >
            <i className={`fa fa-${card.icon} rl-home-icon`}></i>
            <h4>{card.title}</h4>
            <p>{card.description}</p>
          </motion.div>
        ))}
      </div>
      <FloatingNotification userId={user?.uid} />
      <UserAvatar user={user} />
    </div>
  );
}
