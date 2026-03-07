import "./App.css";
import { CharacterButtons } from "./components/CharacterButtons";
import { CrosswordGrid } from "./components/CrosswordGrid";
import { PuzzleSelector } from "./components/PuzzleSelector";
import { usePuzzleState } from "./hooks/usePuzzleState";

function App() {
  const {
    puzzle,
    grid,
    selectedCell,
    checkResult,
    loadPuzzle,
    selectCell,
    inputChar,
    clearCell,
    check,
  } = usePuzzleState();

  if (!puzzle) {
    return (
      <div className="app">
        <h1>Regex Crossword</h1>
        <PuzzleSelector onLoad={loadPuzzle} />
      </div>
    );
  }

  return (
    <div className="app">
      <h1>Regex Crossword</h1>
      <div className="puzzle-info">
        <span>
          {puzzle.rows}x{puzzle.cols}
        </span>
        <span>{puzzle.difficulty}</span>
        <span>seed: {puzzle.seed}</span>
      </div>

      <CrosswordGrid
        rows={puzzle.rows}
        cols={puzzle.cols}
        grid={grid}
        rowHints={puzzle.rowHints}
        colHints={puzzle.colHints}
        selectedCell={selectedCell}
        checkResult={checkResult}
        onSelectCell={selectCell}
      />

      <CharacterButtons
        alphabet={puzzle.alphabet}
        onInput={inputChar}
        onClear={clearCell}
        disabled={selectedCell === null}
      />

      <div className="actions">
        <button type="button" className="check-btn" onClick={check}>
          Check
        </button>
        <button type="button" className="new-puzzle-btn" onClick={() => loadPuzzle(null)}>
          New Puzzle
        </button>
      </div>

      {checkResult && (
        <div className={`result ${checkResult.solved ? "result--solved" : ""}`}>
          {checkResult.solved ? (
            <p>Solved!</p>
          ) : !checkResult.complete ? (
            <p>Fill in all cells first.</p>
          ) : (
            <p>Not quite right. Check the highlighted hints.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
