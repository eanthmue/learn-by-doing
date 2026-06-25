import { describe, expect, test } from "bun:test";
import arrayTraversalMarkdown from "../lessons/arrayTraversal/arrayTraversal.md" with { type: "text" };
import { parseLessonMarkdown } from "./parseLessonMarkdown";

describe("parseLessonMarkdown", () => {
  test("parses array traversal lesson content into the lesson contract", () => {
    const content = parseLessonMarkdown(arrayTraversalMarkdown);

    expect(content.learningGoals).toHaveLength(4);
    expect(content.conceptSections).toHaveLength(6);
    expect(content.conceptSections[0]?.showArrayDiagram).toBe(true);
    expect(content.conceptSections[1]?.pattern).toContain("let result = <initial value>");
    expect(content.complexity.time).toBe("O(n)");
    expect(content.complexity.spaceReason).toContainEqual({ code: "O(n)" });
    expect(content.commonMistakes).toHaveLength(3);
    expect(content.practice.examples).toEqual([
      { input: "countAbove([3, 8, 1, 10, 5], 4)", output: "3" },
      { input: "countAbove([1, 2, 3], 10)", output: "0" },
      { input: "countAbove([], 5)", output: "0" },
      { input: "countAbove([7, 7, 7], 7)", output: "0" },
    ]);
  });
});
