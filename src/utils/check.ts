export interface CheckResult {
  complete: boolean;
  rowResults: boolean[];
  colResults: boolean[];
  solved: boolean;
}

export function checkAnswer(
  grid: (string | null)[][],
  rowHints: string[],
  colHints: string[],
): CheckResult {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;

  const complete = grid.every((row) => row.every((cell) => cell !== null));

  const rowResults = rowHints.map((hint, r) => {
    const rowStr = grid[r].map((c) => c ?? "").join("");
    if (rowStr.length !== cols) return false;
    return new RegExp(hint).test(rowStr);
  });

  const colResults = colHints.map((hint, c) => {
    const colStr = grid.map((row) => row[c] ?? "").join("");
    if (colStr.length !== rows) return false;
    return new RegExp(hint).test(colStr);
  });

  const solved = complete && rowResults.every(Boolean) && colResults.every(Boolean);

  return { complete, rowResults, colResults, solved };
}
