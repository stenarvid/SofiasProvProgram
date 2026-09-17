import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { recordRecentActivity } from "../data/recentActivity";

const routeLabels: Record<string, { label: string; detail: string }> = {
  "/practice": { label: "Kodövningar", detail: "Skriv och rätta kod" },
  "/code-library": { label: "Kodbank", detail: "Koduppgifter och sparade lösningar per ämne" },
  "/debug": { label: "Debug", detail: "Felsök kod" },
  "/mini-projects": { label: "Mini-projekt", detail: "Praktiska projekt" },
  "/exam": { label: "Provläge", detail: "Tidsbaserat prov" },
  "/api-simulator": { label: "Server-simulator", detail: "Träna API/server" },
  "/quiz": { label: "Quiz", detail: "Frågeträning" },
  "/missed-questions": { label: "Missade frågor", detail: "Repetition av tidigare fel" },
  "/daily": { label: "Dagens träning", detail: "Blandat träningspass" },
  "/final-exam": { label: "Slutprov", detail: "Större blandat prov" },
  "/flashcards": { label: "Flashcards", detail: "Snabb repetition" },
  "/code-reading": { label: "Kodläsning", detail: "Förstå kod" },
  "/ts-errors": { label: "TypeScript-fel", detail: "Hitta typfel" },
  "/http": { label: "HTTP", detail: "Requests och responses" },
  "/progress-hub": { label: "Progress", detail: "Statistik och historik" },
  "/oral-exam": { label: "Muntligt prov", detail: "Förklara med egna ord" },
  "/explain-code": { label: "Förklara koden", detail: "Aktiv kodförståelse" },
  "/output-prediction": { label: "Vad blir output?", detail: "Förutse kodresultat" },
  "/mistake-notebook": { label: "Mina misstag", detail: "Personlig felbok" },
  "/exam-checklist": { label: "Provchecklista", detail: "Självskattad förståelse" },
  "/concept-map": { label: "Begreppskarta", detail: "Teknikernas samband" }
};

export default function RouteActivityTracker() {
  const location = useLocation();

  useEffect(() => {
    const config = routeLabels[location.pathname];
    if (!config) return;

    recordRecentActivity({
      id: `route:${location.pathname}${location.search}`,
      label: config.label,
      detail: config.detail,
      to: `${location.pathname}${location.search}`
    });
  }, [location.pathname, location.search]);

  return null;
}
