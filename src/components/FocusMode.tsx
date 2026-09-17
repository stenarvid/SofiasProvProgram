import { useEffect, useState } from "react";

const KEY = "provtraning-focus-mode-v1";

export default function FocusMode() {
  const [active, setActive] = useState(() => localStorage.getItem(KEY) === "1");

  useEffect(() => {
    document.body.classList.toggle("focus-mode", active);
    localStorage.setItem(KEY, active ? "1" : "0");

    const toggle = () => setActive((value) => !value);
    window.addEventListener("toggle-focus-mode", toggle);
    return () => window.removeEventListener("toggle-focus-mode", toggle);
  }, [active]);

  if (!active) return null;

  return (
    <button
      type="button"
      className="focus-exit"
      onClick={() => setActive(false)}
      title="Avsluta fokusläge"
    >
      Avsluta fokus
    </button>
  );
}
