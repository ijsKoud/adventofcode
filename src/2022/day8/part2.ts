import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { srcDir } from "../../lib/constants.js";
import { bold } from "colorette";

function getGrid(map: string): number[][] {
	const rows = map.split("\n");
	const grid = rows.map((row) => row.split("").map((v) => Number(v)));

	return grid;
}

function getVisibilityScore(grid: number[][], rowId: number, key: number): number {
	const row = grid[rowId];
	const topRows = grid.filter((_, k) => k < rowId);
	const bottomRows = grid.filter((_, k) => k > rowId);

	const left = row.slice(0, key).reverse();
	const right = row.slice(key + 1, row.length);
	const top = topRows.map((r) => r.find((_, k) => k === key) as number).reverse();
	const bottom = bottomRows.map((r) => r.find((_, k) => k === key) as number);

	const array = [top, left, bottom, right];
	const scores: number[] = [];

	for (const angleRow of array) {
		let finished = false;

		const score = angleRow
			.map<number>((tree) => {
				const visible = row[key] > tree;
				if (finished) return 0;
				if (!visible) finished = true;

				return 1;
			})
			.reduce((a, b) => a + b, 0);
		scores.push(score);
	}

	return scores.reduce((a, b) => a * b, 1);
}

function getInnerGrid(grid: number[][]) {
	const TopBottomRemoved = grid.slice(1, grid.length - 1);
	const sidesRemoved = TopBottomRemoved.map((row) => row.filter((_, k) => ![0, row.length - 1].includes(k)));

	return sidesRemoved;
}

async function run() {
	const dataFile = join(srcDir, "..", "data", "2022", "day8", "grid.txt");
	const file = await readFile(dataFile, { encoding: "utf8" });

	const grid = getGrid(file);
	const inner = getInnerGrid(grid);

	const res = inner.map((row, rowId) => row.map((_, key) => getVisibilityScore(grid, rowId + 1, key + 1)));
	const highestScore = res.map((row) => row.sort((a, b) => b - a)[0]).sort((a, b) => a - b);
	console.log(`The highest score possible is ${bold(highestScore.pop() ?? 0)}.`);
}

void run();
