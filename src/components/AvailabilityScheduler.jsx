import React, { useEffect, useState } from "react";
import {
  getAvailability,
  saveAvailability,
  suggestMeetingTime,
} from "../controllers/AvailabilityController";
import LoadingSpinner from "./LoadingSpinner";
import SharedToaster from "./SharedToaster";
import "./styles/AvailabilityScheduler.css";

export default function AvailabilityScheduler({
  currentUser = JSON.parse(sessionStorage.getItem("internal-vault-user")),
}) {
  const [availability, setAvailability] = useState({});
  const [teamData, setTeamData] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const teamMembers = [
    {
      key: "mpupile",
      name: "Mpupile Mashifane",
      nickname: "Mitch",
      role: "Business and Partnerships Lead",
    },
    {
      key: "sine",
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
      key: "amahle",
      name: "Lukhaya A. Jenete",
      nickname: "Jenete",
      role: "Technical Lead | Software Engineering",
    },
  ];

  const handleChange = (day, field, value) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    try {
      await saveAvailability(currentUser.key, availability);
      setStatus({ type: "success", message: "Availability saved!" });
      fetchTeamData();
    } catch (err) {
      setStatus({ type: "error", message: "Failed to save availability." });
    }
  };

  const fetchTeamData = async () => {
    setLoading(true);
    try {
      const allData = await getAvailability();
      
      const enriched = teamMembers.map((member) => {
        const found = allData?.find((entry) => entry.key === member.key);
        console.log(found, member.key);
        
        return {
          ...member,
          availability: found?.availability || {},
        };
      });
      setTeamData(enriched);
    } catch (error) {
      setStatus({ type: "error", message: "Failed to fetch team availability." });
    } finally {
      setLoading(false);
    }
  };

  const generateSuggestions = async () => {
    try {
      const allData = await getAvailability();
      const dataMap = {};
      allData.forEach((d) => {
        dataMap[d.key] = d.availability;
      });
      const times = suggestMeetingTime(dataMap);
      setSuggestions(times);
    } catch (error) {
      setStatus({ type: "error", message: "Failed to generate suggestions." });
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, []);

  return (
    <div className="rl-avail-wrapper">
      <h2 className="rl-avail-title">
        <i className="fa fa-calendar-check"></i>Scheduler
      </h2>

      

     <details>
      <summary>Set your availability</summary>
      <p> <div className="rl-avail-form">
        {days.map((day) => (
          <div key={day} className="rl-avail-day-row">
            <h4>{day}</h4>
            <input
              type="time"
              value={availability[day]?.start || ""}
              onChange={(e) => handleChange(day, "start", e.target.value)}
              placeholder="Start time"
            />
            <input
              type="time"
              value={availability[day]?.end || ""}
              onChange={(e) => handleChange(day, "end", e.target.value)}
              placeholder="End time"
            />
          </div>
        ))}
        <button className="rl-avail-save-btn" onClick={handleSave}>
          <i className="fa fa-save"></i> Save My Availability
        </button>
      </div></p>
     </details>
{status && <SharedToaster message={status.message} type={status.type} />}
      <hr className="rl-avail-divider" />

      <details>
        <summary>Generate suggestions</summary>
        <p>
          <div className="rl-avail-suggestions">
        <button className="rl-avail-suggest-btn" onClick={generateSuggestions}>
          <i className="fa fa-lightbulb"></i> Suggest Meeting Times
        </button>

        {suggestions.length > 0 && (
          <div className="rl-avail-suggestion-list">
            <h4>Suggested Meeting Slots</h4>
            <ul>
              {suggestions.map((s, i) => (
                <li key={i}>
                  <i className="fa fa-clock"></i> {s.day}: {s.start} – {s.end}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
        </p>
      </details>

      <hr className="rl-avail-divider" />

      <div className="rl-avail-summary">
        <h4>Team Member Availability</h4>
        {loading ? (
          <LoadingSpinner message="Loading team availability..." />
        ) : (
          teamData?.map((member) => (
            <div key={member.key} className="rl-avail-member-block">
              <strong>{member.name}</strong> <small>({member.nickname})</small>
             <ul>
                {days.map((day) => (
                   <>{ (member.availability?.[day]?.start || member.availability?.[day]?.end) &&<li key={day}>
                    <i className="fa fa-clock"></i> {day}:{" "}
                    {member.availability?.[day]?.start || "-"} to{" "}
                    {member.availability?.[day]?.end || "-"}
                  </li>}</>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
