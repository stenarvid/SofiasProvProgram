import { useEffect } from "react";
import { autoSaveProgressToConnectedFile } from "../data/progressBackup";

export default function ProgressAutoSave() {
  useEffect(() => {
    let timer: number | undefined;

    const save = () => {
      window.clearTimeout(timer);

      timer = window.setTimeout(() => {
        autoSaveProgressToConnectedFile();
      }, 250);
    };

    window.addEventListener("progress-data-changed", save);

    return () => {
      window.removeEventListener("progress-data-changed", save);
      window.clearTimeout(timer);
    };
  }, []);

  return null;
}
