import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getRecentActivity,
  type RecentActivityItem
} from "../data/recentActivity";

export default function RecentActivityCard() {
  const [items, setItems] = useState<RecentActivityItem[]>(() => getRecentActivity());

  useEffect(() => {
    const refresh = () => setItems(getRecentActivity());
    window.addEventListener("recent-activity-updated", refresh);
    return () => window.removeEventListener("recent-activity-updated", refresh);
  }, []);

  return (
    <article className="dashboard-panel recent-card">
      <div className="section-header-row">
        <div>
          <h3>Senast använda</h3>
          <p className="muted">Snabbt tillbaka till det du nyligen jobbade med.</p>
        </div>
      </div>

      {items.length ? (
        <div className="recent-list">
          {items.slice(0, 5).map((item) => (
            <Link key={item.id} to={item.to}>
              <span>
                <strong>{item.label}</strong>
                <small>{item.detail}</small>
              </span>
              <b>→</b>
            </Link>
          ))}
        </div>
      ) : (
        <p>Öppna några teorisidor eller träningslägen så visas de här.</p>
      )}
    </article>
  );
}
