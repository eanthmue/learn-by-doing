import { userCodeWorkerSource } from "./userCodeWorker";

export interface UserCodeResult {
  logs: string[];
  error?: string;
  timedOut?: boolean;
}

type WorkerResponse =
  | { type: "result"; logs: string[] }
  | { type: "error"; message: string };

const RUN_TIMEOUT_MS = 1500;

export function runUserCode(code: string): Promise<UserCodeResult> {
  return new Promise((resolve) => {
    const workerUrl = URL.createObjectURL(
      new Blob([userCodeWorkerSource], { type: "text/javascript" }),
    );
    const worker = new Worker(workerUrl);
    let settled = false;

    const finish = (result: UserCodeResult) => {
      if (settled) {
        return;
      }

      settled = true;
      window.clearTimeout(timeoutId);
      worker.terminate();
      URL.revokeObjectURL(workerUrl);
      resolve(result);
    };

    const timeoutId = window.setTimeout(() => {
      finish({
        logs: [],
        error: `Execution timed out after ${RUN_TIMEOUT_MS}ms.`,
        timedOut: true,
      });
    }, RUN_TIMEOUT_MS);

    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      if (event.data.type === "result") {
        finish({ logs: event.data.logs.length > 0 ? event.data.logs : ["(no output)"] });
        return;
      }

      finish({ logs: [], error: event.data.message });
    };

    worker.onerror = (event) => {
      finish({ logs: [], error: event.message || "Worker execution failed." });
    };

    worker.postMessage({ code });
  });
}
