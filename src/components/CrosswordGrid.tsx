import type { CheckResult } from "../utils/check";
import { Cell } from "./Cell";
import { HintLabel } from "./HintLabel";

interface CrosswordGridProps {
  rows: number;
  cols: number;
  grid: (string | null)[][];
  rowHints: string[];
  colHints: string[];
  selectedCell: [number, number] | null;
  checkResult: CheckResult | null;
  onSelectCell: (row: number, col: number) => void;
}

export function CrosswordGrid({
  rows,
  cols,
  grid,
  rowHints,
  colHints,
  selectedCell,
  checkResult,
  onSelectCell,
}: CrosswordGridProps) {
  return (
    <div className="crossword-container">
      <div
        className="crossword-grid"
        style={{
          gridTemplateColumns: `auto repeat(${cols}, 1fr)`,
          gridTemplateRows: `auto repeat(${rows}, 1fr)`,
        }}
      >
        {/* Top-left empty corner */}
        <div className="grid-corner" />

        {/* Column hints */}
        {colHints.map((hint, c) => (
          <div key={`col-hint-${c}`} className="col-hint">
            <HintLabel hint={hint} result={checkResult ? checkResult.colResults[c] : null} />
          </div>
        ))}

        {/* Rows with row hint + cells */}
        {Array.from({ length: rows }, (_, r) => (
          <div key={`row-${r}`} className="grid-row" style={{ display: "contents" }}>
            <div className="row-hint">
              <HintLabel
                hint={rowHints[r]}
                result={checkResult ? checkResult.rowResults[r] : null}
              />
            </div>
            {Array.from({ length: cols }, (_, c) => (
              <Cell
                key={`cell-${r}-${c}`}
                value={grid[r]?.[c] ?? null}
                selected={selectedCell !== null && selectedCell[0] === r && selectedCell[1] === c}
                onClick={() => onSelectCell(r, c)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
