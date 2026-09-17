import { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  autoSaveProgressToConnectedFile,
  clearStoredHandle,
  connectedFileName,
  connectProgressFile,
  exportProgressDownload,
  importProgressFile,
  supportsDirectFileSave
} from "../data/progressBackup";

export default function BackupPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    connectedFileName().then(setFileName);

    let timer: number | undefined;

    const autoSave = () => {
      window.clearTimeout(timer);

      timer = window.setTimeout(async () => {
        setSaving(true);
        const saved = await autoSaveProgressToConnectedFile();
        setSaving(false);

        if (saved) {
          setMessage(`Autosparad ${new Date().toLocaleTimeString("sv-SE")}`);
        }
      }, 250);
    };

    window.addEventListener("progress-data-changed", autoSave);

    return () => {
      window.removeEventListener("progress-data-changed", autoSave);
      window.clearTimeout(timer);
    };
  }, []);

  async function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await importProgressFile(file);
      setMessage("Progressen importerades.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Kunde inte importera filen."
      );
    } finally {
      event.target.value = "";
    }
  }

  async function connect() {
    try {
      const handle = await connectProgressFile();
      setFileName(handle.name ?? "provtraning-progress.json");
      setMessage("Progressfilen är kopplad och har sparats.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Kunde inte koppla filen."
      );
    }
  }

  async function disconnect() {
    await clearStoredHandle();
    setFileName(null);
    setMessage("Den kopplade filen är borttagen från autosave.");
  }

  return (
    <section>
      <h2>Backup & autosave</h2>

      <p>
        Progressen sparas alltid i localStorage. Här kan du dessutom exportera
        allt till en liten JSON-fil och importera den igen efter att du laddat
        ner projektet på nytt.
      </p>

      <div className="backup-grid">
        <article className="card">
          <h3>Exportera / importera</h3>
          <p>
            Backupen innehåller frågestatistik, ämnesstatistik och testhistorik.
          </p>

          <div className="coding-actions">
            <button
              type="button"
              className="primary-button auto-width"
              onClick={() => {
                exportProgressDownload();
                setMessage("En JSON-backup laddades ner.");
              }}
            >
              Exportera progress
            </button>

            <button
              type="button"
              onClick={() => inputRef.current?.click()}
            >
              Importera progress
            </button>

            <input
              ref={inputRef}
              type="file"
              accept=".json,application/json"
              hidden
              onChange={handleImport}
            />
          </div>
        </article>

        <article className="card">
          <h3>Automatisk progressfil</h3>

          {supportsDirectFileSave() ? (
            <>
              <p>
                Välj en JSON-fil på datorn. När progress ändras försöker sidan
                automatiskt skriva den senaste backupen till samma fil.
              </p>

              {fileName ? (
                <>
                  <p>
                    Kopplad fil: <strong>{fileName}</strong>
                  </p>

                  <div className="coding-actions">
                    <button
                      type="button"
                      className="primary-button auto-width"
                      onClick={async () => {
                        setSaving(true);
                        const ok = await autoSaveProgressToConnectedFile();
                        setSaving(false);
                        setMessage(
                          ok
                            ? "Progressfilen uppdaterades."
                            : "Kunde inte skriva till filen. Webbläsaren kan behöva ny filbehörighet."
                        );
                      }}
                    >
                      Spara nu
                    </button>

                    <button type="button" onClick={disconnect}>
                      Koppla bort
                    </button>
                  </div>
                </>
              ) : (
                <button
                  type="button"
                  className="primary-button"
                  onClick={connect}
                >
                  Koppla progressfil
                </button>
              )}
            </>
          ) : (
            <div className="warning-box">
              Den inbyggda webbläsaren verkar inte stödja direkt skrivning till
              en vald fil. Export/import fungerar fortfarande fullt ut.
            </div>
          )}
        </article>
      </div>

      <div className="panel">
        <h3>Hur fungerar autosave?</h3>
        <p>
          När du svarar på en fråga eller när testhistoriken ändras uppdateras
          localStorage direkt. Om en progressfil är kopplad försöker sidan
          därefter också skriva samma data till JSON-filen.
        </p>
        <p>
          Om webbläsaren tappar filbehörigheten kan du behöva klicka på
          <strong> Spara nu</strong> eller koppla filen igen.
        </p>
      </div>

      {(message || saving) && (
        <div className="backup-status" aria-live="polite">
          {saving ? "Sparar progress..." : message}
        </div>
      )}
    </section>
  );
}
