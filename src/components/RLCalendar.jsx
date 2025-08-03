import React from "react";
import "./styles/RLCalendar.css";

export default function RLCalendar({ tasks = [] }) {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const dueDatesMap = {};
  tasks.forEach((task) => {
    const date = new Date(task.dueDate).getDate();
    if (!dueDatesMap[date]) dueDatesMap[date] = [];
    dueDatesMap[date].push(task);
  });

  const daysArray = Array.from({ length: firstDay }, () => null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );

  return (
    <div className="rl-calendar-wrapper">
      <h3 className="rl-calendar-title">
        <i className="fa fa-calendar-alt"></i> {today.toLocaleString("default", { month: "long" })} {currentYear}
      </h3>
      <div className="rl-calendar-grid">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="rl-calendar-day-header">{day}</div>
        ))}
        {daysArray.map((day, i) => (
          <div key={i} className={`rl-calendar-cell ${day ? "active" : "empty"}`}>
            {day && (
              <div className="rl-calendar-day-content">
                <span className="rl-calendar-date">{day}</span>
                {dueDatesMap[day]?.map((task) => (
                  <div key={task.id} className="rl-calendar-task">
                     {task.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
