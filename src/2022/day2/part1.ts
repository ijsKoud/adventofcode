/* eslint-disable @typescript-eslint/no-duplicate-enum-values */
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

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { srcDir } from "../../lib/constants.js";
import { blue, bold } from "colorette";

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

const loss = 0;
const win = 6;
const draw = 3;

async function run() {
	const dataFile = join(srcDir, "..", "data", "2022", "day2", "rpsresults.txt");
	const file = await readFile(dataFile, { encoding: "utf8" });

	const rounds = file.split("\n");
	const scoreRounds = rounds.map((round) => round.split(/ +/g).map<number>((str) => Number(keyScore[str as unknown as keyScore])));

	let totalScore = 0;
	scoreRounds.forEach((score) => {
		const [opponent, player] = score;

		switch (opponent) {
			case keyScore.A:
				switch (player) {
					case keyScore.X: // rock & rock = draw
						totalScore += draw + player;
						break;
					case keyScore.Y: // Paper (you) beats rock (opponent)
						totalScore += win + player;
						break;
					case keyScore.Z: // Rock (opponent) beats scissors (you)
						totalScore += loss + player;
						break;
					default:
						break;
				}
				break;
			case keyScore.B:
				switch (player) {
					case keyScore.X: // Paper (opponent) beats rock (you)
						totalScore += loss + player;
						break;
					case keyScore.Y: // Paper & paper = draw
						totalScore += draw + player;
						break;
					case keyScore.Z: // Scissors (you) beats paper (opponent)
						totalScore += win + player;
						break;
					default:
						break;
				}
				break;
			case keyScore.C:
				switch (player) {
					case keyScore.X: // Rock (you) beats scissors (opponent)
						totalScore += win + player;
						break;
					case keyScore.Y: // Scissors (opponent) beats paper (you)
						totalScore += loss + player;
						break;
					case keyScore.Z: // scissors & scissors = draw
						totalScore += draw + player;
						break;
					default:
						break;
				}
				break;
			default:
				break;
		}
	});

	console.log(`Your total score of the ${blue("Rock Paper Scissors Tournament")} is ${bold(totalScore)} pts.`);
}

void run();
