import { vi } from "vitest";

// Vitest 2 preserves Node's storage globals when installing jsdom's globals.
// Use the actual jsdom window so storage stays browser-compatible and isolated.
const { window: browserWindow } = (globalThis as typeof globalThis & {
  jsdom: { window: Window };
}).jsdom;

vi.stubGlobal("localStorage", browserWindow.localStorage);
vi.stubGlobal("sessionStorage", browserWindow.sessionStorage);
