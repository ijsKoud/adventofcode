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

Results:
X=loss
Y=draw
Z=win
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

async function run() {
	const dataFile = join(srcDir, "..", "data", "2022", "day2", "rpsresults.txt");
	const file = await readFile(dataFile, { encoding: "utf8" });

	const rounds = file.split("\n");
	const scoreRounds = rounds.map((round) => round.split(/ +/g).map<number>((str) => Number(keyScore[str as unknown as keyScore])));

	let totalScore = 0;
	scoreRounds.forEach((score) => {
		const [opponent, result] = score;

		switch (result) {
			case Results.X: // lose this round
				{
					const key = LoseKeys[opponent as keyof typeof LoseKeys] as number;
					totalScore += key + loss;
				}
				break;
			case Results.Y: // draw this round
				{
					const key = opponent;
					totalScore += key + draw;
				}
				break;
			case Results.Z: // win this round
				{
					const key = WinKeys[opponent as keyof typeof LoseKeys] as number;
					totalScore += key + win;
				}
				break;
		}
	});

	console.log(`Your total score of the ${blue("Rock Paper Scissors Tournament")} is ${bold(totalScore)} pts.`);
}

void run();
