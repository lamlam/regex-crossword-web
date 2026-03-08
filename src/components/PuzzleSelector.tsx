import { useCallback, useRef, useState } from "react";
import type { Puzzle } from "../types/puzzle";
import { presets } from "../data/presets";

interface PuzzleSelectorProps {
  onLoad: (puzzle: Puzzle) => void;
}

export function PuzzleSelector({ onLoad }: PuzzleSelectorProps) {
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const handlePreset = useCallback(
    async (path: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(path);
        const text = await res.text();
        parsePuzzle(text);
      } catch {
        setError("Failed to load preset puzzle");
      } finally {
        setLoading(false);
      }
    },
    [parsePuzzle],
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
    <div className="puzzle-selector-container">
      <p>Select a puzzle to start playing</p>
      <div className="preset-list">
        {presets.map((preset) => (
          <button
            key={preset.path}
            type="button"
            className="preset-btn"
            disabled={loading}
            onClick={() => handlePreset(preset.path)}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="puzzle-selector-divider">
        <span>or upload your own</span>
      </div>

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
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
