import { describe, expect, test } from "bun:test";
import { runUserCode } from "./runUserCode";

if (typeof globalThis.window === "undefined") {
  (globalThis as Record<string, unknown>).window = globalThis;
}

describe("runUserCode", () => {
  test("successfully runs user code and captures logs", async () => {
    const result = await runUserCode('console.log("Hello, LearnByDoing!");');
    expect(result.error).toBeUndefined();
    expect(result.logs).toEqual(["Hello, LearnByDoing!"]);
  });

  test("returns (no output) if there are no console logs", async () => {
    const result = await runUserCode('const x = 5 + 5;');
    expect(result.error).toBeUndefined();
    expect(result.logs).toEqual(["(no output)"]);
  });

  test("handles runtime errors gracefully", async () => {
    const result = await runUserCode('throw new Error("Something went wrong");');
    expect(result.error).toBe("Something went wrong");
    expect(result.logs).toEqual([]);
  });

  test("handles syntax errors gracefully", async () => {
    const result = await runUserCode('const x = ;');
    expect(result.error).toBeDefined();
    expect(result.logs).toEqual([]);
  });

  test("restricts access to sensitive globals", async () => {
    // fetch, globalThis, window, localStorage, document, etc. should be undefined in the runner
    const result = await runUserCode(`
      console.log(typeof fetch);
      console.log(typeof window);
      console.log(typeof document);
    `);
    expect(result.error).toBeUndefined();
    expect(result.logs).toEqual(["undefined", "undefined", "undefined"]);
  });

  test("respects MAX_LOG_LINES constraint", async () => {
    // Generate 60 lines of output; only 50 should be captured
    const result = await runUserCode(`
      for (let i = 0; i < 60; i++) {
        console.log("line", i);
      }
    `);
    expect(result.error).toBeUndefined();
    expect(result.logs).toHaveLength(50);
    expect(result.logs[0]).toBe("line 0");
    expect(result.logs[49]).toBe("line 49");
  });

  test("handles object logging with serialization", async () => {
    const result = await runUserCode(`
      console.log({ a: 1, b: "hello" });
      console.log([1, 2, 3]);
    `);
    expect(result.error).toBeUndefined();
    expect(result.logs).toEqual(['{"a":1,"b":"hello"}', "[1,2,3]"]);
  });

  test("times out infinite loops", async () => {
    const result = await runUserCode('while(true) {}');
    expect(result.timedOut).toBe(true);
    expect(result.error).toContain("Execution timed out");
  }, 5000); // 5s timeout on the test runner side
});
