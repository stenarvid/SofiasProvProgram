export default function HeaderActions() {
  return (
    <div className="header-actions">
      <button
        type="button"
        className="header-search-button"
        onClick={() => window.dispatchEvent(new Event("open-command-palette"))}
        aria-label="Öppna global sök"
      >
        <span aria-hidden="true">⌕</span>
        <span className="header-search-label">Sök</span>
        <kbd>Ctrl K</kbd>
      </button>

      <button
        type="button"
        className="header-help-button"
        onClick={() => window.dispatchEvent(new Event("toggle-shortcut-help"))}
        aria-label="Visa tangentbordsgenvägar"
        title="Tangentbordsgenvägar (?)"
      >
        ?
      </button>
      <button
        type="button"
        className="header-help-button"
        onClick={() => window.dispatchEvent(new Event("toggle-sound-settings"))}
        aria-label="Ljud och effekter"
        title="Ljud och effekter"
      >
        ♪
      </button>
      <button
        type="button"
        className="header-focus-button"
        onClick={() => window.dispatchEvent(new Event("toggle-focus-mode"))}
        aria-label="Fokusläge"
        title="Fokusläge"
      >
        Fokus
      </button>
    </div>
  );
}
