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

	console.log(`The Elf carrying the most Calories is carrying ${bold(highToLow[0])} Calories.`);
}

void run();
