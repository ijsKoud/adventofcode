import { fileURLToPath } from "url";
import { Container } from "../lib/components/Container.js";
import _ from "lodash";
import { bold } from "colorette";

class CalibrationDocument extends Container {
	public constructor() {
		super("document.txt", fileURLToPath(import.meta.url));
	}

	public override execute(input: string): void | Promise<void> {
		const partOne = this.parseInput(input.split("\n"));
		const partTwo = this.advancedParser(input);

		console.log(`Solution for part one: ${bold(partOne)}`);
		console.log(`Solution for part two: ${bold(partTwo)}`);
	}

	/**
	 * Takes textified numbers into account when parsing the input
	 * @param input The input to parse
	 * @returns
	 */
	private advancedParser(input: string) {
		const numbers = {
			one: "o1e",
			two: "t2o",
			three: "th3ee",
			four: "4",
			five: "fi5e",
			six: "6",
			seven: "7n",
			eight: "ei8ht",
			nine: "n9ne"
		};

		Object.entries(numbers).forEach(([key, value]) => (input = input.replaceAll(key, value)));
		return this.parseInput(input.split("\n"));
	}

	/**
	 * Extracts the first and last digit of every string in the array and calculates the sum of them together
	 * @param input The input to parse
	 * @returns
	 */
	private parseInput(input: string[]): number {
		const numbers = this.extractNumbers(input);
		const chunks = numbers
			.map((group) => _.chunk(group, 2))
			.map((chunks) => (chunks.length > 1 ? [...chunks[0], ...chunks[chunks.length - 1]] : chunks[0]))
			.map((chunk) => (chunk.length > 2 ? [chunk[0], chunk[chunk.length - 1]] : chunk));
		const sum = chunks.map((chunk) => this.getSingleTwoDigitNumber(chunk)).reduce((a, b) => a + b, 0);

		return sum;
	}

	/**
	 * Extracts numbers out of an array of strings
	 * @param input Array of strings
	 * @returns Array of groups with numbers
	 */
	private extractNumbers(input: string[]): string[][] {
		return input.map((str) => str.split("").filter(this.isNumber.bind(this)));
	}

	/**
	 * Gets the first and last number of the array or double the first number if the array is 1 item long
	 * @param input The input to parse
	 * @returns a single two-digit number
	 */
	private getSingleTwoDigitNumber(input: string[]): number {
		const [a, b, ...c] = input;

		if (input.length === 1) return Number(`${a}${a}`);
		else if (input.length > 2) return Number(`${a}${c[input.length - 3]}`);

		return Number(`${a}${b}`);
	}

	/**
	 * Checks whether the input is a number or not
	 * @param input The input to check
	 * @returns
	 */
	private isNumber(input: string): boolean {
		if (!["1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(input)) return false;
		return !isNaN(Number(input));
	}
}

const instance = new CalibrationDocument();
void instance.run();
