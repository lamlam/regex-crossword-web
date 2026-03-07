export interface Puzzle {
  rows: number;
  cols: number;
  difficulty: string;
  seed: number;
  alphabet: string;
  rowHints: string[];
  colHints: string[];
  solution: string[][];
}
