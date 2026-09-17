import { useState } from "react";
import ProgressPage from "./ProgressPage";
import CodeProgressPage from "./CodeProgressPage";
import HistoryPage from "./HistoryPage";
import StatsPage from "./StatsPage";
import BackupPage from "./BackupPage";
import ReadinessPage from "./ReadinessPage";
import SavedStudyPage from "./SavedStudyPage";

type Tab = "overview" | "readiness" | "saved" | "questions" | "code" | "history" | "backup";

export default function ProgressHubPage() {
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <section className="progress-hub">
      <div className="hub-hero">
        <span className="topic-badge">Progress</span>
        <h2>Din utveckling</h2>
        <p>All statistik, missade frågor, kodresultat, historik och backup på ett ställe.</p>
      </div>

      <nav className="progress-tabs" aria-label="Progress-sektioner">
        <button className={tab === "overview" ? "active" : ""} onClick={() => setTab("overview")}>
          Översikt
        </button>
        <button className={tab === "readiness" ? "active" : ""} onClick={() => setTab("readiness")}>
          Provberedskap
        </button>
        <button className={tab === "saved" ? "active" : ""} onClick={() => setTab("saved")}>
          Sparat
        </button>
        <button className={tab === "questions" ? "active" : ""} onClick={() => setTab("questions")}>
          Ämnen
        </button>
        <button className={tab === "code" ? "active" : ""} onClick={() => setTab("code")}>
          Kod
        </button>
        <button className={tab === "history" ? "active" : ""} onClick={() => setTab("history")}>
          Historik
        </button>
        <button className={tab === "backup" ? "active" : ""} onClick={() => setTab("backup")}>
          Backup
        </button>
      </nav>

      <div className="progress-tab-content">
        {tab === "overview" && <ProgressPage />}
        {tab === "readiness" && <ReadinessPage />}
        {tab === "saved" && <SavedStudyPage />}
        {tab === "questions" && <StatsPage />}
        {tab === "code" && <CodeProgressPage />}
        {tab === "history" && <HistoryPage />}
        {tab === "backup" && <BackupPage />}
      </div>
    </section>
  );
}
