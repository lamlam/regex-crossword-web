export interface PresetPuzzle {
  label: string;
  path: string;
}

export const presets: PresetPuzzle[] = [
  { label: "Easy (3x3)", path: "/puzzles/easy.json" },
  { label: "Medium (4x4)", path: "/puzzles/medium.json" },
  { label: "Hard (5x5)", path: "/puzzles/hard.json" },
];
