import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

type NavItem = {
  to: string;
  label: string;
  description?: string;
};

type NavGroup = {
  label: string;
  paths: string[];
  items: NavItem[];
};

const groups: NavGroup[] = [
  {
    label: "Lär dig",
    paths: [
      "/topics",
      "/cheat-sheet",
      "/mistakes",
      "/matching",
      "/explain"
    ],
    items: [
      { to: "/topics", label: "Ämnen & teori", description: "React, State, Router, Fetch, Jotai, Zod, Hono m.m." },
      { to: "/cheat-sheet", label: "Cheat sheet", description: "Snabb syntax och sista-minuten-repetition." },
      { to: "/mistakes", label: "Vanliga fel", description: "Misstag som är lätta att göra på provet." },
      { to: "/matching", label: "Begrepp", description: "Koppla begrepp till rätt betydelse." },
      { to: "/explain", label: "Förklara", description: "Träna på att förklara med egna ord." }
    ]
  },
  {
    label: "Träna",
    paths: [
      "/practice",
      "/debug",
      "/completion",
      "/quick-errors",
      "/mini-projects",
      "/chain",
      "/flashcards",
      "/code-reading",
      "/http",
      "/ts-errors",
      "/api-simulator"
    ],
    items: [
      { to: "/practice", label: "Kodövningar", description: "Skriv kod med lätt/normal/svår och automatisk rättning." },
      { to: "/debug", label: "Debug", description: "Hitta och fixa fel i kod." },
      { to: "/completion", label: "Kodkomplettering", description: "Fyll i saknade delar av koden." },
      { to: "/quick-errors", label: "Snabbfel", description: "Korta 'vad är fel här?'-uppgifter." },
      { to: "/mini-projects", label: "Mini-projekt", description: "Kombinera flera områden i samma uppgift." },
      { to: "/chain", label: "Kedjeuppgifter", description: "Bygg vidare steg för steg mellan flera tekniker." },
      { to: "/flashcards", label: "Flashcards", description: "Snabb repetition av begrepp." },
      { to: "/code-reading", label: "Kodläsning", description: "Förstå vad befintlig kod faktiskt gör." },
      { to: "/http", label: "HTTP-träning", description: "GET, POST, statuskoder, request och response." },
      { to: "/ts-errors", label: "TypeScript-fel", description: "Lär dig tolka TypeScript-fel." },
      { to: "/api-simulator", label: "Server-simulator", description: "Se request → server → response." }
    ]
  },
  {
    label: "Test & prov",
    paths: [
      "/quiz",
      "/daily",
      "/exam",
      "/final-exam"
    ],
    items: [
      { to: "/daily", label: "Dagens träning", description: "En blandad träningsrunda för dagen." },
      { to: "/quiz", label: "Quiz", description: "Välj ämnen och antal frågor." },
      { to: "/exam", label: "Provläge", description: "Timer och slumpade praktiska uppgifter." },
      { to: "/final-exam", label: "Slutprov", description: "Större simulerat prov med flera moment." }
    ]
  },
  {
    label: "Min progress",
    paths: [
      "/progress",
      "/code-progress",
      "/stats",
      "/history",
      "/backup"
    ],
    items: [
      { to: "/progress", label: "Översikt", description: "Mastery, missade frågor och långsiktig progress." },
      { to: "/code-progress", label: "Kodprogress", description: "Försök, delpoäng, hints och facitvisningar." },
      { to: "/stats", label: "Ämnesstatistik", description: "Rätt/fel per område." },
      { to: "/history", label: "Testhistorik", description: "Se tidigare quizresultat." },
      { to: "/backup", label: "Backup", description: "Exportera, importera och autospara progress." }
    ]
  }
];

export default function GroupedNav() {
  const location = useLocation();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setOpenGroup(null);
  }, [location.pathname]);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenGroup(null);
      }
    };

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <nav className="grouped-nav" ref={navRef} aria-label="Huvudnavigation">
      <NavLink className="nav-home-link" to="/">
        Start
      </NavLink>

      {groups.map((group) => {
        const active = group.paths.some(
          (path) =>
            location.pathname === path ||
            location.pathname.startsWith(`${path}/`)
        );
        const open = openGroup === group.label;

        return (
          <div className="nav-group" key={group.label}>
            <button
              type="button"
              className={`nav-group-button ${active ? "active" : ""}`}
              aria-expanded={open}
              onClick={() => setOpenGroup(open ? null : group.label)}
            >
              {group.label}
              <span aria-hidden="true">{open ? "▲" : "▼"}</span>
            </button>

            {open && (
              <div className="nav-dropdown">
                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `nav-dropdown-item ${isActive ? "active" : ""}`
                    }
                  >
                    <strong>{item.label}</strong>
                    {item.description && <small>{item.description}</small>}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
