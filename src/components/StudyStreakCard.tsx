import { useEffect, useState } from "react";
import {
  getCurrentStreak,
  getWeekActivity
} from "../data/studyActivity";

export default function StudyStreakCard() {
  const [streak, setStreak] = useState(() => getCurrentStreak());
  const [week, setWeek] = useState(() => getWeekActivity());

  useEffect(() => {
    const refresh = () => {
      setStreak(getCurrentStreak());
      setWeek(getWeekActivity());
    };

    window.addEventListener("study-activity-updated", refresh);
    return () => window.removeEventListener("study-activity-updated", refresh);
  }, []);

  const activeThisWeek = week.filter((day) => day.active).length;

  return (
    <article className="dashboard-panel streak-card">
      <div className="section-header-row">
        <div>
          <h3>Streak</h3>
          <p className="muted">Faktiska studiedagar med quiz, kod eller avklarad teori.</p>
        </div>
        <strong className="streak-number">{streak}</strong>
      </div>

      <div className="streak-week" aria-label={`${activeThisWeek} aktiva dagar senaste sju dagarna`}>
        {week.map((day) => (
          <div key={day.date} className={day.active ? "active" : ""} title={day.date}>
            <span />
            <small>{day.label}</small>
          </div>
        ))}
      </div>

      <p className="streak-summary">{activeThisWeek} av de senaste 7 dagarna aktiva.</p>
    </article>
  );
}
