# CLAUDE.md

## プロジェクト概要

正規表現クロスワードパズルの Web UI (SPA)。`../regex-crossword` (Go CLI) が生成する JSON をブラウザで遊べるようにする。

## 技術スタック

- React 19 + TypeScript + Vite
- oxlint (lint) / oxfmt (format)
- Playwright (E2E テスト、Chromium のみ)

## コマンド

- `npm run dev` — 開発サーバー
- `npm run build` — tsc + vite build
- `npm run lint` — oxlint ./src
- `npm run format` — oxfmt ./src
- `npx playwright test` — E2E テスト（事前に `npm run build` が必要）

## プロジェクト構成

```
src/
├── types/puzzle.ts          # Puzzle インターフェース
├── utils/check.ts           # 解答チェックロジック（正規表現マッチ）
├── hooks/usePuzzleState.ts  # パズル状態管理フック
├── components/
│   ├── CrosswordGrid.tsx    # CSS Grid レイアウト
│   ├── Cell.tsx             # セル
│   ├── HintLabel.tsx        # 行/列ヒント表示
│   ├── CharacterButtons.tsx # アルファベットボタン
│   └── PuzzleSelector.tsx   # JSON ファイルアップロード
e2e/
└── puzzle.spec.ts           # Playwright E2E テスト
public/puzzles/
└── sample.json              # サンプルパズル
```

## 注意点（過去の手戻りから）

### ESM 環境では `__dirname` が使えない

このプロジェクトは `"type": "module"` の ESM 環境。Playwright テスト等で `__dirname` を使うとエラーになる。代わりに以下を使うこと:

```ts
import path from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
```

### Vite プロジェクト作成時の対話プロンプト

`npm create vite@latest` は対話的プロンプトが出てブロックする場合がある。`--overwrite` フラグを付けて既存ディレクトリへの上書きを許可すること。
