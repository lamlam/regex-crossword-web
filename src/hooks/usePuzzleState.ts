import { useCallback, useState } from "react";
import type { Puzzle } from "../types/puzzle";
import { type CheckResult, checkAnswer } from "../utils/check";

export function usePuzzleState() {
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [grid, setGrid] = useState<(string | null)[][]>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [checkResult, setCheckResult] = useState<CheckResult | null>(null);

  const loadPuzzle = useCallback((p: Puzzle | null) => {
    setPuzzle(p);
    if (p) {
      setGrid(Array.from({ length: p.rows }, () => Array(p.cols).fill(null)));
    } else {
      setGrid([]);
    }
    setSelectedCell(null);
    setCheckResult(null);
  }, []);

  const selectCell = useCallback((row: number, col: number) => {
    setSelectedCell([row, col]);
  }, []);

  const inputChar = useCallback(
    (char: string) => {
      if (!selectedCell) return;
      const [r, c] = selectedCell;
      setGrid((prev) => {
        const next = prev.map((row) => [...row]);
        next[r][c] = char;
        return next;
      });
      setCheckResult(null);
    },
    [selectedCell],
  );

  const clearCell = useCallback(() => {
    if (!selectedCell) return;
    const [r, c] = selectedCell;
    setGrid((prev) => {
      const next = prev.map((row) => [...row]);
      next[r][c] = null;
      return next;
    });
    setCheckResult(null);
  }, [selectedCell]);

  const check = useCallback(() => {
    if (!puzzle) return;
    setCheckResult(checkAnswer(grid, puzzle.rowHints, puzzle.colHints));
  }, [puzzle, grid]);

  return {
    puzzle,
    grid,
    selectedCell,
    checkResult,
    loadPuzzle,
    selectCell,
    inputChar,
    clearCell,
    check,
  };
}
