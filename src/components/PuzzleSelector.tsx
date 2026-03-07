import { useCallback, useRef, useState } from "react";
import type { Puzzle } from "../types/puzzle";

interface PuzzleSelectorProps {
  onLoad: (puzzle: Puzzle) => void;
}

export function PuzzleSelector({ onLoad }: PuzzleSelectorProps) {
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parsePuzzle = useCallback(
    (text: string) => {
      try {
        const data = JSON.parse(text);
        if (
          !data.rows ||
          !data.cols ||
          !data.rowHints ||
          !data.colHints ||
          !data.solution ||
          !data.alphabet
        ) {
          setError("Invalid puzzle JSON: missing required fields");
          return;
        }
        setError(null);
        onLoad(data as Puzzle);
      } catch {
        setError("Invalid JSON file");
      }
    },
    [onLoad],
  );

  const handleFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        parsePuzzle(e.target?.result as string);
      };
      reader.readAsText(file);
    },
    [parsePuzzle],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  return (
    <div
      className={`puzzle-selector${isDragOver ? " puzzle-selector--dragover" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
    >
      <p>Drop a puzzle JSON file here, or click to select</p>
      <button type="button" onClick={() => fileInputRef.current?.click()}>
        Select File
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: "none" }}
        onChange={handleFileInput}
      />
      {error && <p className="error">{error}</p>}
    </div>
  );
}
