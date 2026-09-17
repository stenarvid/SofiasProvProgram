import { useEffect, useState } from "react";

const groups = [
  {
    title: "Överallt",
    items: [
      ["Ctrl/⌘ + K", "Öppna global sök"],
      ["/", "Öppna global sök när du inte skriver"],
      ["?", "Visa den här genvägshjälpen"],
      ["Esc", "Stäng popup/panel där det är möjligt"],
      ["R", "Öppna smart träning"],
      ["F", "Slå på/av fokusläge"]
    ]
  },
  {
    title: "Lär dig",
    items: [
      ["← / →", "Föregående / nästa sida"],
      ["S", "Fokusera teorisökningen"],
      ["N", "Fokusera egna anteckningar"],
      ["Q", "Öppna sidquiz"],
      ["C", "Öppna kodövning"],
      ["H", "Öppna cheat sheet"],
      ["B", "Bokmärk / ta bort bokmärke"],
      ["M", "Markera sidan klar / inte klar"],
      ["O", "Öppna / stäng Öva på sidan"]
    ]
  }
];

export default function ShortcutHelp() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function toggle() {
      setOpen((value) => !value);
    }

    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      const typing =
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        target?.isContentEditable ||
        !!target?.closest(".monaco-editor");

      if (!typing && event.key === "?") {
        event.preventDefault();
        setOpen((value) => !value);
      } else if (open && event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      }
    }

    window.addEventListener("toggle-shortcut-help", toggle);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("toggle-shortcut-help", toggle);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="shortcut-backdrop" onMouseDown={() => setOpen(false)}>
      <section
        className="shortcut-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Tangentbordsgenvägar"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="shortcut-modal-heading">
          <div>
            <span className="study-tool-label">Snabbkommandon</span>
            <h2>Tangentbordsgenvägar</h2>
          </div>
          <button type="button" onClick={() => setOpen(false)} aria-label="Stäng">×</button>
        </div>

        <div className="shortcut-groups">
          {groups.map((group) => (
            <article key={group.title}>
              <h3>{group.title}</h3>
              <div>
                {group.items.map(([key, description]) => (
                  <p key={key}>
                    <kbd>{key}</kbd>
                    <span>{description}</span>
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
