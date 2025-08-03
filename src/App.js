// APP ENTRY - App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from "react-router-dom";
import { onUserStateChange } from "./auth/AuthController";
import LoginForm from "./components/LoginForm";
import ProjectBoard from "./components/ProjectBoard";
import StatsDashboard from "./components/StatsDashboard";
import UploadDocument from "./components/UploadDocument";
import CalendarView from "./components/CalendarView";
import HomePage from "./components/HomePage";
import UserProfile from "./components/UserProfile";
import RevenueDashboard from "./components/RevenueDashboard";
import FeatureBuilder from "./components/FeatureBuilder";
import CompanyInfo from "./components/CompanyInfo";

function App() {
  const [user, setUser] = useState(null);
  const [enrichedUserx, setEnrichedUserX] = useState(null);

  useEffect(() => {
    const unsubscribe = onUserStateChange(setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
      const userCache = sessionStorage.getItem("internal-vault-user");

      const teamMembers = [
        {
          key: "mpupile",
          name: "Mpupile Mashifane",
          nickname: "Mitch",
          role: "Business and Partnerships Lead",
        },
        {
          key: "sine", // covers "sinengomso"
          name: "Sinengomso Dom",
          nickname: "Sne",
          role: "Marketing and Operations Coordinator",
        },
        {
          key: "yonela",
          name: "Yonela Xongwana",
          nickname: "Theo",
          role: "Technical Assistant | Software Engineering",
        },
        {
          key: "amahle", // or use "jenete" for broader match
          name: "Lukhaya A. Jenete",
          nickname: "Jenete",
          role: "Technical Lead | Software Engineering",
        },
      ];

      if (user || userCache) {
        const { email, lastLoginAt, uid } = user || JSON.parse(userCache);

        const found = teamMembers.find((member) =>
          email.toLowerCase().includes(member.key)
        );

        const enrichedUser = {
          email,
          lastLoginAt,
          uid,
          ...(found || {
            name: "Unknown",
            nickname: "User",
            role: "Contributor",
          }),
        };

        sessionStorage.setItem(
          "internal-vault-user",
          JSON.stringify(enrichedUser)
        );
        setEnrichedUserX(enrichedUser);
      }
    }, [user]);


  return (
    <Router>
      <Routes>
        <Route path="/login" element={enrichedUserx ? <Navigate to="/" />: <LoginForm onLogin={setUser} />}  />
        <Route path="/" element={enrichedUserx ? <HomePage user={enrichedUserx}/> : <Navigate to="/login" />} />
        <Route path="/dashboard" element={enrichedUserx ? <StatsDashboard /> : <Navigate to="/login" />} />
        <Route path="/board/:projectId" element={enrichedUserx ? <ProjectBoardWrapper /> : <Navigate to="/login" />} />
        <Route path="/revenue/:projectId" element={enrichedUserx ? <RevenueDashboard /> : <Navigate to="/login" />} />
        <Route path="/profile" element={enrichedUserx ? <UserProfile user={enrichedUserx} /> : <Navigate to="/login" />}/>
        <Route path="/feature/:projectId" element={enrichedUserx ? <FeatureBuilder user={enrichedUserx} /> : <Navigate to="/login" />}/>
        <Route path="/company/:projectId" element={enrichedUserx ? <CompanyInfo user={enrichedUserx} /> : <Navigate to="/login" />}/>
        <Route path="/documents/:projectId" element={enrichedUserx ? <UploadDocumentWrapper /> : <Navigate to="/login" />} />
        <Route path="/calendar" element={enrichedUserx ? <CalendarView start="2025-01-01" end="2025-12-31" /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

function ProjectBoardWrapper() {
  const { projectId } = useParams();
  return <ProjectBoard projectId={projectId} />;
}

function UploadDocumentWrapper() {
  const { projectId } = useParams();
  return <UploadDocument projectId={projectId} />;
}

export default App;
