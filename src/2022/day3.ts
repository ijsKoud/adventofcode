import { bold } from "colorette";
import { Container } from "../lib/components/Container.js";
import { fileURLToPath } from "node:url";

class RugSackOrganisation extends Container {
	public constructor() {
		super("rugsack.txt", fileURLToPath(import.meta.url));
	}

	protected override execute(input: string): void {
		const partOne = this.partOne(input);
		const partTwo = this.partTwo(input);

		console.log(`The sum of priorities of the duplicate items is ${bold(partOne)}`);
		console.log(`The sum of priorities of the badges is ${bold(partTwo)}`);
	}

	/**
	 * The logic behind the solution for part one
	 * @param input The assignment input
	 * @returns
	 */
	private partOne(input: string) {
		const splitRugsack = (rugsack: string): string[] => {
			const halfSize = rugsack.length * 0.5;
			return [rugsack.slice(0, halfSize), rugsack.slice(halfSize, rugsack.length)];
		};

		const getDuplicate = (compartments: string[]) => {
			const [compOne, compTwo] = compartments;
			const itemsCompOne = compOne.split("");
			const itemsCompTwo = compTwo.split("");

			return itemsCompOne.find((item) => itemsCompTwo.includes(item))!;
		};

		const rugsacks = input.split("\n");
		const compartments = rugsacks.map(splitRugsack);
		const duplicates = compartments.map(getDuplicate);

		const priorityList = this.getItemPriorityList();
		const sumOfPriorities = duplicates.map((duplicate) => priorityList[duplicate]).reduce((a, b) => a + b, 0);

		return sumOfPriorities;
	}

	/**
	 * The logic behind the solution for part two
	 * @param input The assignment input
	 * @returns
	 */
	private partTwo(input: string) {
		const getGroups = (rugsacks: string[]): string[][] => {
			const groupSize = 3;
			const groups: string[][] = [];

			for (let i = 0; i < rugsacks.length; i += groupSize) {
				groups.push(rugsacks.slice(i, i + groupSize));
			}

			return groups;
		};

		const getDuplicate = (rugsacks: string[]): string => {
			const [one, two, three] = rugsacks;
			const splitOne = one.split("");
			const duplicateOneTwo = splitOne.filter((item) => two.includes(item));
			const duplicateOneThree = splitOne.filter((item) => three.includes(item));
			const duplicates = duplicateOneTwo.find((item) => duplicateOneThree.includes(item));

			return duplicates!;
		};

		const rugsacks = input.split("\n");
		const groups = getGroups(rugsacks);
		const duplicates = groups.map(getDuplicate);

		const priorityList = this.getItemPriorityList();
		const sumOfPriorities = duplicates.map((duplicate) => priorityList[duplicate]).reduce((a, b) => a + b, 0);

		return sumOfPriorities;
	}

	/**
	 * Maps the alphabet in priority order
	 * @returns
	 */
	private getItemPriorityList(): PriorityList {
		const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
		const list = alphabet.split("").map((char, key) => ({ char, priority: key + 1 }));
		const map: PriorityList = {};

		list.forEach((item) => (map[item.char] = item.priority));

		return map;
	}
}

interface PriorityList {
	[key: string]: number;
}

const instance = new RugSackOrganisation();
void instance.run();
