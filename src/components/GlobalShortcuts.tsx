import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function GlobalShortcuts() {
  const navigate = useNavigate();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      const typing =
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        target?.isContentEditable ||
        !!target?.closest(".monaco-editor");

      if (typing || event.ctrlKey || event.metaKey || event.altKey) return;

      if (event.key.toLowerCase() === "r") {
        event.preventDefault();
        navigate("/smart-practice");
      } else if (event.key.toLowerCase() === "f") {
        event.preventDefault();
        window.dispatchEvent(new Event("toggle-focus-mode"));
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [navigate]);

  return null;
}
