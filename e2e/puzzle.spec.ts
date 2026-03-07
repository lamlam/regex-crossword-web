import path from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test.describe("Regex Crossword", () => {
  test("shows puzzle selector on initial load", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toHaveText("Regex Crossword");
    await expect(page.locator(".puzzle-selector")).toBeVisible();
    await expect(page.getByText("Drop a puzzle JSON file here")).toBeVisible();
  });

  test("loads puzzle from file and displays grid", async ({ page }) => {
    await page.goto("/");

    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(
      path.resolve(__dirname, "../public/puzzles/sample.json"),
    );

    // Grid should appear with 3x3 cells
    await expect(page.locator(".cell")).toHaveCount(9);

    // Row hints should be visible
    await expect(page.getByText("^H4[4HU]$")).toBeVisible();
    await expect(page.getByText("^Y[04U]X$")).toBeVisible();
    await expect(page.getByText("^H8[UY]$")).toBeVisible();

    // Col hints should be visible
    await expect(page.getByText("^HY[4H]$")).toBeVisible();
    await expect(page.getByText("^[4HX]08$")).toBeVisible();

    // Alphabet buttons should appear
    for (const char of "0248HUXY") {
      await expect(
        page.locator(".char-btn", { hasText: new RegExp(`^${char}$`) }),
      ).toBeVisible();
    }
    await expect(page.locator(".char-btn--clear")).toBeVisible();

    // Puzzle info
    await expect(page.getByText("3x3")).toBeVisible();
    await expect(page.getByText("medium")).toBeVisible();
  });

  test("can select cell and input character", async ({ page }) => {
    await page.goto("/");
    await page
      .locator('input[type="file"]')
      .setInputFiles(
        path.resolve(__dirname, "../public/puzzles/sample.json"),
      );

    await expect(page.locator(".cell")).toHaveCount(9);

    // Click first cell
    const firstCell = page.locator(".cell").first();
    await firstCell.click();
    await expect(firstCell).toHaveClass(/cell--selected/);

    // Character buttons should be enabled
    const hBtn = page.locator(".char-btn", { hasText: /^H$/ });
    await expect(hBtn).toBeEnabled();

    // Click 'H' button
    await hBtn.click();
    await expect(firstCell).toHaveText("H");
  });

  test("can clear a cell", async ({ page }) => {
    await page.goto("/");
    await page
      .locator('input[type="file"]')
      .setInputFiles(
        path.resolve(__dirname, "../public/puzzles/sample.json"),
      );

    const firstCell = page.locator(".cell").first();
    await firstCell.click();

    // Input a character
    await page.locator(".char-btn", { hasText: /^H$/ }).click();
    await expect(firstCell).toHaveText("H");

    // Clear it
    await firstCell.click();
    await page.locator(".char-btn--clear").click();
    await expect(firstCell).toHaveText("");
  });

  test("check button shows incomplete message when grid not filled", async ({
    page,
  }) => {
    await page.goto("/");
    await page
      .locator('input[type="file"]')
      .setInputFiles(
        path.resolve(__dirname, "../public/puzzles/sample.json"),
      );

    await page.locator(".check-btn").click();
    await expect(page.getByText("Fill in all cells first.")).toBeVisible();
  });

  test("solving the puzzle correctly shows solved message", async ({
    page,
  }) => {
    await page.goto("/");
    await page
      .locator('input[type="file"]')
      .setInputFiles(
        path.resolve(__dirname, "../public/puzzles/sample.json"),
      );

    // Solution: H,4,4 / Y,0,X / H,8,U
    const solution = [
      ["H", "4", "4"],
      ["Y", "0", "X"],
      ["H", "8", "U"],
    ];

    const cells = page.locator(".cell");
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const cell = cells.nth(r * 3 + c);
        await cell.click();
        await page
          .locator(".char-btn", {
            hasText: new RegExp(`^${solution[r][c]}$`),
          })
          .click();
      }
    }

    await page.locator(".check-btn").click();
    await expect(page.getByText("Solved!")).toBeVisible();

    // Hints should be green
    const correctHints = page.locator(".hint-label--correct");
    await expect(correctHints).toHaveCount(6); // 3 row + 3 col
  });

  test("wrong answer shows error feedback", async ({ page }) => {
    await page.goto("/");
    await page
      .locator('input[type="file"]')
      .setInputFiles(
        path.resolve(__dirname, "../public/puzzles/sample.json"),
      );

    // Fill all cells with 'H'
    const cells = page.locator(".cell");
    for (let i = 0; i < 9; i++) {
      await cells.nth(i).click();
      await page.locator(".char-btn", { hasText: /^H$/ }).click();
    }

    await page.locator(".check-btn").click();
    await expect(
      page.getByText("Not quite right. Check the highlighted hints."),
    ).toBeVisible();

    // Some hints should be red
    await expect(page.locator(".hint-label--incorrect").first()).toBeVisible();
  });

  test("new puzzle button returns to selector", async ({ page }) => {
    await page.goto("/");
    await page
      .locator('input[type="file"]')
      .setInputFiles(
        path.resolve(__dirname, "../public/puzzles/sample.json"),
      );

    await expect(page.locator(".cell")).toHaveCount(9);

    await page.locator(".new-puzzle-btn").click();
    await expect(page.locator(".puzzle-selector")).toBeVisible();
  });
});
