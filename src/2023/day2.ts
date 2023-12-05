import { fileURLToPath } from "url";
import { Container } from "../lib/components/Container.js";
import _ from "lodash";
import { bold } from "colorette";

class CubeConundrum extends Container {
	public constructor() {
		super("game-results.txt", fileURLToPath(import.meta.url));
	}

	public override execute(input: string): void | Promise<void> {
		const partOne = this.getSumOfValidGames(input);
		const partTwo = this.getSumOfCubePowers(input);
		console.log(`Solution for part one: ${bold(partOne)}`);
		console.log(`Solution for part two: ${bold(partTwo)}`);
	}

	/**
	 * Calculates the sum of the cubes values multiplied by each other
	 * @param input The input to parse
	 * @returns
	 */
	private getSumOfCubePowers(input: string) {
		const gameResults = input
			.split("\n")
			.map((game) => this.getResultsFromGame(game.split(":")[1]))
			.map((game) => this.getFewestPossibleCubes(game));

		const sum = gameResults.map((res) => Object.values(res).reduce((a, b) => a * b, 1)).reduce((a, b) => a + b, 0);
		return sum;
	}

	/**
	 * Calculates the sum of the ids of the games that satisfy the game rules
	 * @param input The input to parse
	 * @returns
	 */
	private getSumOfValidGames(input: string) {
		const CUBE_LIMITS = { red: 12, green: 13, blue: 14 };
		const verify = (round: GameRound) => round.red <= CUBE_LIMITS.red && round.green <= CUBE_LIMITS.green && round.blue <= CUBE_LIMITS.blue;

		const gameResults = input
			.split("\n")
			.map<[number, GameRound[]]>((game, idx) => [idx + 1, this.getResultsFromGame(game.split(":")[1])])
			.reduce<[number, GameRound[]][]>((a, b) => [...a, b], []);

		const sum = gameResults.filter(([, results]) => results.every(verify)).reduce((a, b) => a + b[0], 0);
		return sum;
	}

	/**
	 * Gets the cubes drawn in each round and calculates the total
	 * @param game The game data to parse
	 * @returns The total amount of cubes that were drawn
	 */
	private getResultsFromGame(game: string) {
		const rounds = game.split(";").map(this.getCubesFromRound.bind(this));
		return rounds;
	}

	/**
	 * Retrieves the amount of cubes that were drawn in a round
	 * @param round The round to parse
	 * @returns The amount of cubes that were drawn in this round
	 */
	private getCubesFromRound(round: string): GameRound {
		return round
			.split(",")
			.map((cube) => cube.trim().split(" "))
			.reduce((a, b) => ({ ...a, [b[1]]: Number(b[0]) }), { red: 0, blue: 0, green: 0 });
	}

	/**
	 * Gets the fewest possible cubes that are drawn per color
	 * @param game The game to parse
	 * @returns
	 */
	private getFewestPossibleCubes(game: GameRound[]) {
		return game.reduce((a, b) => _.mergeWith(a, b, (dest, src) => (dest < src ? src : dest)), { red: 0, green: 0, blue: 0 });
	}
}

interface GameRound {
	red: number;
	green: number;
	blue: number;
}

const instance = new CubeConundrum();
void instance.run();
