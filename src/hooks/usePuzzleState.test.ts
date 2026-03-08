import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Puzzle } from "../types/puzzle";
import { usePuzzleState } from "./usePuzzleState";

const samplePuzzle: Puzzle = {
  rows: 2,
  cols: 2,
  difficulty: "easy",
  seed: 1,
  alphabet: "ABCD",
  rowHints: ["^AB$", "^CD$"],
  colHints: ["^AC$", "^BD$"],
  solution: [
    ["A", "B"],
    ["C", "D"],
  ],
};

describe("usePuzzleState", () => {
  it("loadPuzzle initializes empty grid of correct dimensions", () => {
    const { result } = renderHook(() => usePuzzleState());

    act(() => {
      result.current.loadPuzzle(samplePuzzle);
    });

    expect(result.current.puzzle).toBe(samplePuzzle);
    expect(result.current.grid).toEqual([
      [null, null],
      [null, null],
    ]);
    expect(result.current.selectedCell).toBeNull();
    expect(result.current.checkResult).toBeNull();
  });

  it("loadPuzzle(null) resets state", () => {
    const { result } = renderHook(() => usePuzzleState());

    act(() => {
      result.current.loadPuzzle(samplePuzzle);
    });
    act(() => {
      result.current.loadPuzzle(null);
    });

    expect(result.current.puzzle).toBeNull();
    expect(result.current.grid).toEqual([]);
  });

  it("selectCell + inputChar sets grid value", () => {
    const { result } = renderHook(() => usePuzzleState());

    act(() => {
      result.current.loadPuzzle(samplePuzzle);
    });
    act(() => {
      result.current.selectCell(0, 1);
    });
    act(() => {
      result.current.inputChar("B");
    });

    expect(result.current.grid[0][1]).toBe("B");
  });

  it("clearCell clears selected cell", () => {
    const { result } = renderHook(() => usePuzzleState());

    act(() => {
      result.current.loadPuzzle(samplePuzzle);
    });
    act(() => {
      result.current.selectCell(0, 0);
    });
    act(() => {
      result.current.inputChar("A");
    });

    expect(result.current.grid[0][0]).toBe("A");

    act(() => {
      result.current.clearCell();
    });

    expect(result.current.grid[0][0]).toBeNull();
  });

  it("check produces correct CheckResult", () => {
    const { result } = renderHook(() => usePuzzleState());

    act(() => {
      result.current.loadPuzzle(samplePuzzle);
    });

    // Fill in correct solution
    const solution = [
      ["A", "B"],
      ["C", "D"],
    ];
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 2; c++) {
        act(() => {
          result.current.selectCell(r, c);
        });
        act(() => {
          result.current.inputChar(solution[r][c]);
        });
      }
    }

    act(() => {
      result.current.check();
    });

    expect(result.current.checkResult).toEqual({
      complete: true,
      solved: true,
      rowResults: [true, true],
      colResults: [true, true],
    });
  });

  it("inputChar without selection is a no-op", () => {
    const { result } = renderHook(() => usePuzzleState());

    act(() => {
      result.current.loadPuzzle(samplePuzzle);
    });

    const gridBefore = result.current.grid.map((row) => [...row]);

    act(() => {
      result.current.inputChar("X");
    });

    expect(result.current.grid).toEqual(gridBefore);
  });
});
