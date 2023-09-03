/* eslint-disable @typescript-eslint/no-duplicate-enum-values */

import { blue, bold } from "colorette";
import { Container } from "../lib/components/Container.js";
import { fileURLToPath } from "node:url";

/** The amount of points that are given when you use a certain move */
enum keyScore {
	// Opponent
	A = 1, // Rock
	B = 2, // Paper
	C = 3, // Scissors

	// Player (you)
	X = 1, // Rock
	Y = 2, // Paper
	Z = 3 // Scissors
}

/** The amount of points that are given when the match is finished */
enum Results {
	X = 1, // loss
	Y = 2, // draw
	Z = 3 // win
}

const LoseKeys = {
	1: 3, // Rock (opponent) beats scissors (you)
	2: 1, // Paper (opponent) beats rock (you)
	3: 2 // Scissors (opponent) beats paper (you)
};

const WinKeys = {
	1: 2, // Rock (opponent) < Paper (you)
	2: 3, // Paper (opponent) < Scissors (you)
	3: 1 // Scissors (opponent) < Rock (you)
};

const loss = 0;
const win = 6;
const draw = 3;

/*
Opponent:
A=Rock
B=Paper
C=Scissors

You:
X=Rock
Y=Paper
Z=Scissors

Score:
Rock=1
Paper=2
Scissors=3

win=6
draw=3
loss=1
*/

class RockPaperScissors extends Container {
	public constructor() {
		super("rpsresults.txt", fileURLToPath(import.meta.url));
	}

	protected override execute(input: string): void {
		const rounds = input.split("\n");
		const gameOneScore = this.gameOne(rounds);
		const gameTwoScore = this.gameTwo(rounds);

		console.log(`Your total score for ${bold("part 1")} of the ${blue("Rock Paper Scissors Tournament")} is ${bold(gameOneScore)} pts.`);
		console.log(`Your total score for ${bold("part 2")} of the ${blue("Rock Paper Scissors Tournament")} is ${bold(gameTwoScore)} pts.`);
	}

	/**
	 * The logic behind the solution for part 1
	 * @param rounds The game rounds
	 * @returns
	 */
	private gameOne(rounds: string[]): number {
		const scoreRounds = rounds.map((round) => round.split(/ +/g).map<number>((str) => Number(keyScore[str as any])));
		const calculateRound = (opponent: number, player: number) => {
			if (opponent === player) return draw + player; // for draws

			switch (opponent) {
				case keyScore.A:
					/**
					WIN: Paper (you) beats rock (opponent)
					LOSE: Rock (opponent) beats scissors (you)
					*/
					return (player === keyScore.Y ? win : loss) + player;
				case keyScore.B:
					/**
						WIN: Scissors (you) beats paper (opponent)
						LOSE: Paper (opponent) beats rock (you)
						*/
					return (player === keyScore.Z ? win : loss) + player;
				case keyScore.C:
					/**
						WIN: Rock (you) beats scissors (opponent)
						LOSE: Scissors (opponent) beats paper (you)
						*/
					return (player === keyScore.X ? win : loss) + player;
				default:
					return 0;
			}
		};

		return scoreRounds.map(([opponent, player]) => calculateRound(opponent, player)).reduce((a, b) => a + b, 0);
	}

	/**
	 * The logic behind the solution for part 2
	 * @param rounds The game rounds
	 * @returns
	 */
	private gameTwo(rounds: string[]) {
		const scoreRounds = rounds.map((round) => round.split(/ +/g).map<number>((str) => Number(keyScore[str as any])));
		const calculateRound = (opponent: number, result: number) => {
			switch (result) {
				case Results.X: {
					// lose this round
					const key = LoseKeys[opponent as keyof typeof LoseKeys] as number;
					return key + loss;
				}

				case Results.Y: {
					// draw this round
					const key = opponent;
					return key + draw;
				}

				case Results.Z: {
					// win this round
					const key = WinKeys[opponent as keyof typeof LoseKeys] as number;
					return key + win;
				}

				default:
					return 0;
			}
		};

		return scoreRounds.map(([opponent, result]) => calculateRound(opponent, result)).reduce((a, b) => a + b, 0);
	}
}

const instance = new RockPaperScissors();
void instance.run();
