const STORAGE_KEYS = [
  "provtraning-progress-v1",
  "provtraning-question-progress-v2",
  "provtraning-test-history-v1",
  "provtraning-code-progress-v1",
  "provtraning-study-flow-v1",
  "provtraning-daily-goals-v1",
  "provtraning-study-activity-v1",
  "provtraning-recent-activity-v1",
  "provtraning-audio-settings-v1",
  "provtraning-mistake-notes-v1",
  "provtraning-exam-checklist-v1",
  "provtraning-focus-mode-v1"
];

const DB_NAME = "provtraning-backup-db";
const STORE_NAME = "handles";
const HANDLE_KEY = "progress-file";

export type ProgressBackup = {
  version: 1;
  exportedAt: string;
  data: Record<string, unknown>;
};

function makeBackup(): ProgressBackup {
  const data: Record<string, unknown> = {};

  for (const key of STORAGE_KEYS) {
    const raw = localStorage.getItem(key);

    if (raw !== null) {
      try {
        data[key] = JSON.parse(raw);
      } catch {
        data[key] = raw;
      }
    }
  }

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    data
  };
}

export function exportProgressDownload() {
  const backup = makeBackup();
  const blob = new Blob(
    [JSON.stringify(backup, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `provtraning-progress-${new Date()
    .toISOString()
    .slice(0, 10)}.json`;

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(url);
}

export async function importProgressFile(file: File) {
  const text = await file.text();
  const backup = JSON.parse(text) as ProgressBackup;

  if (
    !backup ||
    backup.version !== 1 ||
    typeof backup.data !== "object"
  ) {
    throw new Error("Filen verkar inte vara en giltig progress-backup.");
  }

  for (const key of STORAGE_KEYS) {
    const value = backup.data[key];

    if (value !== undefined) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  window.dispatchEvent(new CustomEvent("question-progress-updated"));
  window.dispatchEvent(new CustomEvent("progress-data-changed"));
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function storeHandle(handle: unknown) {
  const db = await openDb();

  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(handle, HANDLE_KEY);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });

  db.close();
}

export async function getStoredHandle(): Promise<any | null> {
  try {
    const db = await openDb();

    const handle = await new Promise<any>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const req = tx.objectStore(STORE_NAME).get(HANDLE_KEY);
      req.onsuccess = () => resolve(req.result ?? null);
      req.onerror = () => reject(req.error);
    });

    db.close();
    return handle;
  } catch {
    return null;
  }
}

export async function clearStoredHandle() {
  try {
    const db = await openDb();

    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).delete(HANDLE_KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });

    db.close();
  } catch {
    // Ignore cleanup failures.
  }
}

export function supportsDirectFileSave() {
  return "showSaveFilePicker" in window;
}

export async function connectProgressFile() {
  const picker = (window as any).showSaveFilePicker;

  if (!picker) {
    throw new Error(
      "Den här webbläsaren stöder inte direkt skrivning till en vald fil."
    );
  }

  const handle = await picker({
    suggestedName: "provtraning-progress.json",
    types: [
      {
        description: "JSON progress backup",
        accept: {
          "application/json": [".json"]
        }
      }
    ]
  });

  await storeHandle(handle);
  await writeBackupToHandle(handle);

  return handle;
}

async function ensureWritePermission(handle: any) {
  if (!handle) return false;

  if (typeof handle.queryPermission !== "function") return true;

  const options = { mode: "readwrite" };

  if ((await handle.queryPermission(options)) === "granted") {
    return true;
  }

  if (typeof handle.requestPermission === "function") {
    return (await handle.requestPermission(options)) === "granted";
  }

  return false;
}

export async function writeBackupToHandle(handle: any) {
  if (!handle) return false;

  const allowed = await ensureWritePermission(handle);
  if (!allowed) return false;

  const writable = await handle.createWritable();
  await writable.write(JSON.stringify(makeBackup(), null, 2));
  await writable.close();

  return true;
}

export async function autoSaveProgressToConnectedFile() {
  const handle = await getStoredHandle();
  if (!handle) return false;

  try {
    return await writeBackupToHandle(handle);
  } catch {
    return false;
  }
}

export async function connectedFileName(): Promise<string | null> {
  const handle = await getStoredHandle();
  return handle?.name ?? null;
}
