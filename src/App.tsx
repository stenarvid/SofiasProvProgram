import { Link, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import TopicPage from "./components/TopicPage";
import QuizPage from "./components/QuizPage";
import PracticePage from "./components/PracticePage";
import DebugPage from "./components/DebugPage";
import MiniProjectsPage from "./components/MiniProjectsPage";
import ExamModePage from "./components/ExamModePage";
import StatsPage from "./components/StatsPage";
import ApiSimulatorPage from "./components/ApiSimulatorPage";

import QuickErrorsPage from "./components/QuickErrorsPage";
import CodeCompletionPage from "./components/CodeCompletionPage";
import MatchingPage from "./components/MatchingPage";
import ExplainPage from "./components/ExplainPage";
import HistoryPage from "./components/HistoryPage";
import ChainTasksPage from "./components/ChainTasksPage";
import CheatSheetPage from "./components/CheatSheetPage";
import ProgressPage from "./components/ProgressPage";
import FlashcardsPage from "./components/FlashcardsPage";
import CodeReadingPage from "./components/CodeReadingPage";
import HttpTrainerPage from "./components/HttpTrainerPage";
import TypeScriptErrorsPage from "./components/TypeScriptErrorsPage";
import DailyMixPage from "./components/DailyMixPage";
import FinalExamPage from "./components/FinalExamPage";
import CommonMistakesPage from "./components/CommonMistakesPage";
import BackupPage from "./components/BackupPage";
import ProgressAutoSave from "./components/ProgressAutoSave";
import CodeProgressPage from "./components/CodeProgressPage";
import SimpleNav from "./components/SimpleNav";
import TopicsPage from "./components/TopicsPage";
import TrainingHubPage from "./components/TrainingHubPage";
import TestHubPage from "./components/TestHubPage";
import ProgressHubPage from "./components/ProgressHubPage";
import TopicCheckpointPage from "./components/TopicCheckpointPage";
import SmartPracticePage from "./components/SmartPracticePage";
import RouteActivityTracker from "./components/RouteActivityTracker";
import HeaderActions from "./components/HeaderActions";
import GlobalShortcuts from "./components/GlobalShortcuts";
import ShortcutHelp from "./components/ShortcutHelp";
import CommandPalette from "./components/CommandPalette";
import ConceptMapPage from "./components/ConceptMapPage";
import ExamChecklistPage from "./components/ExamChecklistPage";
import MistakeNotebookPage from "./components/MistakeNotebookPage";
import OutputPredictionPage from "./components/OutputPredictionPage";
import ExplainCodePage from "./components/ExplainCodePage";
import OralExamPage from "./components/OralExamPage";
import FocusMode from "./components/FocusMode";
import SoundSettings from "./components/SoundSettings";
import StudyFeedback from "./components/StudyFeedback";
import CodeLibraryPage from "./components/CodeLibraryPage";
import MissedQuestionsPage from "./components/MissedQuestionsPage";
import TerminologyPage from "./components/TerminologyPage";

export default function App() {
  return (
    <div className="app">
      <ProgressAutoSave />
      <RouteActivityTracker />
      <GlobalShortcuts />
      <CommandPalette />
      <ShortcutHelp />
      <StudyFeedback />
      <SoundSettings />
      <FocusMode />

      <header className="app-header">
        <div className="app-header-inner">
          <Link className="app-brand" to="/" aria-label="Gå till startsidan">
            <span className="app-brand-mark">RT</span>
            <div>
              <strong>Provträning</strong>
              <small>React + TypeScript</small>
            </div>
          </Link>

          <div className="header-nav-cluster">
            <SimpleNav />
            <HeaderActions />
          </div>
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/topic/:topicId" element={<TopicPage />} />
          <Route path="/train" element={<TrainingHubPage />} />
          <Route path="/test" element={<TestHubPage />} />
          <Route path="/progress-hub" element={<ProgressHubPage />} />
          <Route path="/practice" element={<PracticePage />} />
          <Route path="/debug" element={<DebugPage />} />
          <Route path="/mini-projects" element={<MiniProjectsPage />} />
          <Route path="/exam" element={<ExamModePage />} />
          <Route path="/api-simulator" element={<ApiSimulatorPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/quick-errors" element={<QuickErrorsPage />} />
          <Route path="/completion" element={<CodeCompletionPage />} />
          <Route path="/matching" element={<MatchingPage />} />
          <Route path="/explain" element={<ExplainPage />} />
          <Route path="/chain" element={<ChainTasksPage />} />
          <Route path="/cheat-sheet" element={<CheatSheetPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/code-progress" element={<CodeProgressPage />} />
          <Route path="/code-library" element={<CodeLibraryPage />} />
          <Route path="/flashcards" element={<FlashcardsPage />} />
          <Route path="/code-reading" element={<CodeReadingPage />} />
          <Route path="/http" element={<HttpTrainerPage />} />
          <Route path="/ts-errors" element={<TypeScriptErrorsPage />} />
          <Route path="/daily" element={<DailyMixPage />} />
          <Route path="/mistakes" element={<CommonMistakesPage />} />
          <Route path="/final-exam" element={<FinalExamPage />} />
          <Route path="/backup" element={<BackupPage />} />
          <Route path="/topics" element={<TopicsPage />} />
          <Route path="/terminology" element={<TerminologyPage />} />
          <Route path="/terminology/:topicSlug" element={<TerminologyPage />} />
          <Route path="/checkpoint/:topicSlug" element={<TopicCheckpointPage />} />
          <Route path="/smart-practice" element={<SmartPracticePage />} />
          <Route path="/oral-exam" element={<OralExamPage />} />
          <Route path="/explain-code" element={<ExplainCodePage />} />
          <Route path="/output-prediction" element={<OutputPredictionPage />} />
          <Route path="/mistake-notebook" element={<MistakeNotebookPage />} />
          <Route path="/exam-checklist" element={<ExamChecklistPage />} />
          <Route path="/concept-map" element={<ConceptMapPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/missed-questions" element={<MissedQuestionsPage />} />
        </Routes>
      </main>
    </div>
  );
}
