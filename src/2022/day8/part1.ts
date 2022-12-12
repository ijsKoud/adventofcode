import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { srcDir } from "../../lib/constants.js";
import { bold } from "colorette";

function getGrid(map: string): number[][] {
	const rows = map.split("\n");
	const grid = rows.map((row) => row.split("").map((v) => Number(v)));

	return grid;
}

function isVisible(grid: number[][], rowId: number, key: number): boolean {
	const row = grid[rowId];
	const topRows = grid.filter((_, k) => k < rowId);
	const bottomRows = grid.filter((_, k) => k > rowId);

	const right = row.slice(0, key);
	const left = row.slice(key + 1, row.length);
	const top = topRows.map((r) => r.find((_, k) => k === key) as number);
	const bottom = bottomRows.map((r) => r.find((_, k) => k === key) as number);

	const array = [right, left, bottom, top];
	return array.some((angle) => angle.every((v) => row[key] > v));
}

function getInnerGrid(grid: number[][]) {
	const TopBottomRemoved = grid.slice(1, grid.length - 1);
	const sidesRemoved = TopBottomRemoved.map((row) => row.filter((_, k) => ![0, row.length - 1].includes(k)));

	return sidesRemoved;
}

function getOuterGridAmount(grid: number[][]) {
	const topAndBottom = [grid[0], grid[grid.length - 1]];
	const sides = grid.slice(1, grid.length - 1).map((row) => row.filter((_, k) => [0, row.length - 1].includes(k)));
	const sum = topAndBottom.reduce((a, b) => a + b.length, 0) + sides.reduce((a, b) => a + b.length, 0);

	return sum;
}

async function run() {
	const dataFile = join(srcDir, "..", "data", "2022", "day8", "grid.txt");
	const file = await readFile(dataFile, { encoding: "utf8" });

	const grid = getGrid(file);
	const inner = getInnerGrid(grid);
	const outer = getOuterGridAmount(grid);

	const res = inner.map((row, rowId) => row.map((_, key) => isVisible(grid, rowId + 1, key + 1)));
	const treesVisible = res.map((bool) => bool.filter((b) => b)).reduce((a, b) => a + b.length, 0) + outer;
	console.log(`The amount of visible trees outside the grid is ${bold(treesVisible)}.`);
}

void run();
