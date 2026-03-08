import { describe, expect, it } from "vitest";
import { checkAnswer } from "./check";

describe("checkAnswer", () => {
  it("returns solved for a correct solution", () => {
    // 2x2 grid: rows must match "AB" and "CD", cols must match "AC" and "BD"
    const grid = [
      ["A", "B"],
      ["C", "D"],
    ];
    const rowHints = ["^AB$", "^CD$"];
    const colHints = ["^AC$", "^BD$"];

    const result = checkAnswer(grid, rowHints, colHints);
    expect(result).toEqual({
      complete: true,
      solved: true,
      rowResults: [true, true],
      colResults: [true, true],
    });
  });

  it("returns incomplete when grid has null cells", () => {
    const grid: (string | null)[][] = [
      ["A", null],
      ["C", "D"],
    ];
    const rowHints = ["^AB$", "^CD$"];
    const colHints = ["^AC$", "^BD$"];

    const result = checkAnswer(grid, rowHints, colHints);
    expect(result.complete).toBe(false);
    expect(result.solved).toBe(false);
  });

  it("returns not solved for wrong answers", () => {
    const grid = [
      ["X", "Y"],
      ["Z", "W"],
    ];
    const rowHints = ["^AB$", "^CD$"];
    const colHints = ["^AC$", "^BD$"];

    const result = checkAnswer(grid, rowHints, colHints);
    expect(result.complete).toBe(true);
    expect(result.solved).toBe(false);
    expect(result.rowResults).toEqual([false, false]);
    expect(result.colResults).toEqual([false, false]);
  });

  it("handles empty grid", () => {
    const grid: (string | null)[][] = [];
    const rowHints: string[] = [];
    const colHints: string[] = [];

    const result = checkAnswer(grid, rowHints, colHints);
    expect(result.complete).toBe(true);
    expect(result.solved).toBe(true);
  });

  it("handles single cell puzzle", () => {
    const grid = [["A"]];
    const rowHints = ["^A$"];
    const colHints = ["^A$"];

    const result = checkAnswer(grid, rowHints, colHints);
    expect(result).toEqual({
      complete: true,
      solved: true,
      rowResults: [true],
      colResults: [true],
    });
  });
});
