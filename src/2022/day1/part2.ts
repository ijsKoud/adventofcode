import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { srcDir } from "../../lib/constants.js";
import { bold } from "colorette";

async function run() {
	const dataFile = join(srcDir, "..", "data", "2022", "day1", "calories.txt");
	const file = await readFile(dataFile, { encoding: "utf8" });

	const splitPerElf = file.split("\n\n");
	const totalCaloriesPerElf = splitPerElf.map((str) => str.split("\n").reduce((a, b) => a + Number(b), 0));
	const highToLow = totalCaloriesPerElf.sort((a, b) => b - a);
	const sumOfThree = highToLow.slice(0, 3).reduce((a, b) => a + b, 0);

	console.log(`The top 3 Elves are carrying a total of ${bold(sumOfThree)} Calories.`);
}

void run();
