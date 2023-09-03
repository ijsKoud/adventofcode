import { bold } from "colorette";
import { Container } from "../lib/components/Container.js";
import { fileURLToPath } from "node:url";

class CalorieCounting extends Container {
	public constructor() {
		super("calories.txt", fileURLToPath(import.meta.url));
	}

	protected override execute(input: string): void {
		const splitPerElf = input.split("\n\n");
		const totalCaloriesPerElf = splitPerElf.map((str) => str.split("\n").reduce((a, b) => a + Number(b), 0));
		const highToLow = totalCaloriesPerElf.sort((a, b) => b - a);
		const sumOfThree = highToLow.slice(0, 3).reduce((a, b) => a + b, 0);

		console.log(`The Elf carrying the most Calories is carrying ${bold(highToLow[0])} Calories.`);
		console.log(`The top 3 Elves are carrying a total of ${bold(sumOfThree)} Calories.`);
	}
}

const instance = new CalorieCounting();
void instance.run();
