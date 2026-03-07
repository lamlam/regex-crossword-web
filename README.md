# Regex Crossword Web

[regex-crossword](https://github.com/lamlam/regex-crossword) (Go CLI) が生成する正規表現クロスワードパズルの JSON ファイルを、ブラウザ上で遊べる SPA Web UI。

## 遊び方

1. パズル JSON ファイルをドラッグ&ドロップ、またはファイル選択でアップロード
2. グリッドのセルをクリックして選択
3. 下部のアルファベットボタンで文字を入力（Clear で削除）
4. 「Check」ボタンで正規表現との一致を検証
   - 正解のヒントは緑、不一致は赤でハイライト表示

## パズル JSON フォーマット

```json
{
  "rows": 3,
  "cols": 3,
  "difficulty": "medium",
  "seed": 100,
  "alphabet": "0248HUXY",
  "rowHints": ["^H4[4HU]$", "^Y[04U]X$", "^H8[UY]$"],
  "colHints": ["^HY[4H]$", "^[4HX]08$", "^(YXY|4[04X]U)$"],
  "solution": [["H","4","4"],["Y","0","X"],["H","8","U"]]
}
```

サンプルファイル: `public/puzzles/sample.json`

## 開発

```bash
npm install
npm run dev
```

### スクリプト

| コマンド | 説明 |
|---|---|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | TypeScript チェック + プロダクションビルド |
| `npm run preview` | ビルド済みファイルのプレビュー |
| `npm run lint` | oxlint による静的解析 |
| `npm run format` | oxfmt によるフォーマット |

### E2E テスト

```bash
npx playwright install chromium
npm run build
npx playwright test
```

## 技術スタック

- React + TypeScript
- Vite
- oxlint / oxfmt
- Playwright (E2E テスト)
