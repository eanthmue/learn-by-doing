export const userCodeWorkerSource = String.raw`
const workerGlobal = globalThis;
const sendMessage = workerGlobal.postMessage.bind(workerGlobal);

const disabledGlobalNames = [
  "fetch",
  "XMLHttpRequest",
  "WebSocket",
  "EventSource",
  "Worker",
  "SharedWorker",
  "importScripts",
  "localStorage",
  "sessionStorage",
  "indexedDB",
  "caches",
  "navigator",
  "location",
  "document",
  "window",
  "self",
  "globalThis",
  "postMessage",
  "close",
  "BroadcastChannel",
  "MessageChannel",
  "MessagePort",
];

const MAX_LOG_LINES = 50;
const MAX_LOG_CHARS = 2000;

function disableSensitiveGlobals() {
  for (const name of disabledGlobalNames) {
    try {
      Object.defineProperty(workerGlobal, name, {
        configurable: true,
        value: undefined,
        writable: false,
      });
    } catch (_) {
      // Some browser globals are non-configurable. User code also receives shadowing parameters.
    }
  }
}

function formatLogValue(value) {
  if (typeof value === "string") {
    return value;
  }

  try {
    return JSON.stringify(value);
  } catch (_) {
    return String(value);
  }
}

function addLog(logs, values) {
  if (logs.length >= MAX_LOG_LINES) {
    return;
  }

  const line = values.map(formatLogValue).join(" ").slice(0, MAX_LOG_CHARS);
  logs.push(line);
}

workerGlobal.onmessage = (event) => {
  const code = event.data.code;

  if (typeof code !== "string") {
    sendMessage({ type: "error", message: "Runner received invalid code." });
    return;
  }

  const logs = [];
  const fakeConsole = {
    log: (...args) => addLog(logs, args),
    warn: (...args) => addLog(logs, args),
    error: (...args) => addLog(logs, args),
  };

  try {
    disableSensitiveGlobals();
    const run = new Function(
      "console",
      ...disabledGlobalNames,
      '"use strict";\n' + code,
    );
    run(fakeConsole, ...disabledGlobalNames.map(() => undefined));
    sendMessage({ type: "result", logs });
  } catch (error) {
    sendMessage({
      type: "error",
      message: error instanceof Error ? error.message : String(error),
    });
  }
};
`;
