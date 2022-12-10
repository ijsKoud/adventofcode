/*
.234.....  2-4
.....678.  6-8

.23......  2-3
...45....  4-5

....567..  5-7
......789  7-9 // overlap

.2345678.  2-8
..34567..  3-7 // overlap

.....6...  6-6
...456...  4-6 // overlap

.23456...  2-6 // overlap
...45678.  4-8
*/

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { srcDir } from "../../lib/constants.js";
import { bold } from "colorette";

function getCrateSetup(rawSetup: string): CrateSetup {
	const stacks: CrateSetup = {};
	const cratesPerRowRaw = rawSetup.split("\n").map((str) => [...str].filter((_, k) => k % 4 === 1).map((str) => str.trim()));
	const cratesPerRow = cratesPerRowRaw.slice(0, cratesPerRowRaw.length - 1).reverse();

	for (const crates of cratesPerRow) {
		const addCreate = (crate: string, key: number) => {
			if (!crate.length) return;

			const stack = stacks[key + 1] ?? [];
			stack.push(crate);

			stacks[key + 1] = stack;
		};
		crates.forEach(addCreate);
	}

	return stacks;
}

function getMoves(rawMoves: string): Moves {
	const getMove = (move: string): Move => {
		const moveRes = /move (\d+) from (\d+) to (\d+)/g.exec(move);
		if (!moveRes) throw new Error("No moves received from Regex run");

		return {
			amount: Number(moveRes[1]),
			from: Number(moveRes[2]),
			to: Number(moveRes[3])
		};
	};

	const rawMovesList = rawMoves.split("\n");
	const moves = rawMovesList.map(getMove);

	return moves;
}

async function run() {
	const dataFile = join(srcDir, "..", "data", "2022", "day5", "crates-moves.txt");
	const file = await readFile(dataFile, { encoding: "utf8" });

	const [rawCrateSetup, rawMoves] = file.split("\n\n");
	const crateSetup = getCrateSetup(rawCrateSetup);
	const moves = getMoves(rawMoves);

	for (const move of moves) {
		const stackFrom = crateSetup[move.from];
		const stackTo = crateSetup[move.to];

		const toMove: string[] = [];
		const moveCrate = () => {
			const crate = stackFrom.pop()!;
			toMove.push(crate);
		};

		Array(move.amount).fill(null).forEach(moveCrate);
		stackTo.push(...toMove);

		crateSetup[move.from] = stackFrom;
		crateSetup[move.to] = stackTo;
	}

	const topCrates = Object.keys(crateSetup).map((key) => crateSetup[key].pop());
	console.log(`The top crates are ${bold(topCrates.join(""))}.`);
}

void run();

interface CrateSetup {
	[key: string]: string[];
}

interface Move {
	amount: number;
	from: number;
	to: number;
}

type Moves = Move[];
