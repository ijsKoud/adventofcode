import { bold } from "colorette";
import { Container } from "../lib/components/Container.js";
import { fileURLToPath } from "node:url";

class SupplyStacks extends Container {
	public constructor() {
		super("crates-moves.txt", fileURLToPath(import.meta.url));
	}

	protected override execute(input: string): void {
		const [rawCrateSetup, rawMoves] = input.split("\n\n");
		const crateSetup = this.getCrateSetup(rawCrateSetup);
		const moves = this.getMoves(rawMoves);

		const partOne = this.partOne(structuredClone(crateSetup), moves);
		const partTwo = this.partTwo(structuredClone(crateSetup), moves);
		console.log(`Part One: The top crates are ${bold(partOne.join(""))}.`);
		console.log(`Part Two: The top crates are ${bold(partTwo.join(""))}.`);
	}

	/**
	 * The logic behind the solution for part 1
	 * @param crateSetup the initial crate setup
	 * @param moves The moves to make
	 * @returns
	 */
	private partOne(crateSetup: CrateSetup, moves: Moves) {
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
		return topCrates;
	}

	/**
	 * The logic behind the solution for part 2
	 * @param crateSetup the initial crate setup
	 * @param moves The moves to make
	 * @returns
	 */
	private partTwo(crateSetup: CrateSetup, moves: Moves) {
		for (const move of moves) {
			const stackFrom = crateSetup[move.from];
			const stackTo = crateSetup[move.to];

			const toMove = stackFrom.splice(-move.amount, move.amount);
			crateSetup[move.to] = stackTo.concat(toMove);
		}

		const topCrates = Object.keys(crateSetup).map((key) => crateSetup[key].pop());
		return topCrates;
	}

	/**
	 * Converts the input to object of stacks
	 * @param rawSetup The input
	 * @returns
	 */
	private getCrateSetup(rawSetup: string): CrateSetup {
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

	/**
	 * Converts the input to readable moves
	 * @param rawMoves The input
	 * @returns
	 */
	private getMoves(rawMoves: string): Moves {
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
}

interface CrateSetup {
	[key: string]: string[];
}

interface Move {
	amount: number;
	from: number;
	to: number;
}

type Moves = Move[];

const instance = new SupplyStacks();
void instance.run();
