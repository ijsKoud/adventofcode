import { bold } from "colorette";
import { Container } from "../lib/components/Container.js";
import { fileURLToPath } from "node:url";

class Tree {
	public height: number;
	public row: number;
	public column: number;

	public readonly grid: Grid;

	public top: Tree[] = [];
	public bottom: Tree[] = [];
	public left: Tree[] = [];
	public right: Tree[] = [];

	public constructor(height: number, row: number, column: number, grid: Grid) {
		this.height = height;
		this.row = row;
		this.column = column;
		this.grid = grid;
	}

	public isVisible() {
		const left = this.left.every((tree) => tree.height < this.height);
		const right = this.right.every((tree) => tree.height < this.height);
		const top = this.top.every((tree) => tree.height < this.height);
		const bottom = this.bottom.every((tree) => tree.height < this.height);

		return left || right || top || bottom;
	}

	public getNeighbours() {
		const row = this.grid.rows.get(this.row)!;
		this.left = row.filter((tree) => tree.column < this.column);
		this.right = row.filter((tree) => tree.column > this.column);

		if (this.row > 0)
			this.top = Array(this.row)
				.fill(null)
				.map((_, idx) => this.grid.rows.get(idx)![this.column]);

		const gridSize = [...this.grid.rows.keys()].sort((a, b) => b - a)[0];
		if (this.row < gridSize)
			this.bottom = Array(gridSize - this.row)
				.fill(null)
				.map((_, idx) => this.grid.rows.get(idx + this.row + 1)![this.column]);
	}
}

class Grid {
	public rows: Map<number, Tree[]> = new Map();

	public generate(input: string) {
		const rows = input.split("\n");
		let idx = 0;

		for (const row of rows) {
			const trees = row.split("").map((treeHeight, col) => new Tree(Number(treeHeight), idx, col, this));
			this.rows.set(idx, trees);

			idx++;
		}

		[...this.rows.values()].forEach((trees) => trees.forEach((tree) => tree.getNeighbours()));
		return this;
	}

	public getVisibleTrees() {
		return [...this.rows.values()].map((trees) => trees.filter((tree) => tree.isVisible()).length).reduce((a, b) => a + b, 0);
	}
}

class TreeGrid extends Container {
	public constructor() {
		super("grid.txt", fileURLToPath(import.meta.url));
	}

	protected override execute(input: string): void {
		const grid = new Grid().generate(input);
		console.log(`The amount of visible trees outside the grid is ${bold(grid.getVisibleTrees())}.`);
		console.log(`The highest score possible is ${bold(this.partTwo(input))}.`);
	}

	/**
	 * Logic behind the solution for part 2
	 * @param input The puzzle input
	 * @deprecated Will be replaced with updated code soon
	 */
	private partTwo(input: string) {
		function getGrid(map: string): number[][] {
			const rows = map.split("\n");
			const grid = rows.map((row) => row.split("").map((v) => Number(v)));

			return grid;
		}

		function getInnerGrid(grid: number[][]) {
			const TopBottomRemoved = grid.slice(1, grid.length - 1);
			const sidesRemoved = TopBottomRemoved.map((row) => row.filter((_, k) => ![0, row.length - 1].includes(k)));

			return sidesRemoved;
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

		const grid = getGrid(input);
		const inner = getInnerGrid(grid);

		const res = inner.map((row, rowId) => row.map((_, key) => getVisibilityScore(grid, rowId + 1, key + 1)));
		const highestScore = res.map((row) => row.sort((a, b) => b - a)[0]).sort((a, b) => a - b);

		return highestScore.pop() ?? 0;
	}
}

const instance = new TreeGrid();
void instance.run();
