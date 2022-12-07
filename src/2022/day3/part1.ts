/*
per rugsack (string) 2 compartments
1 duplicate per rugsack (item in both compartments)

a-z -> 1-26
A-Z -> 27-52
*/

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { srcDir } from "../../lib/constants.js";
import { bold } from "colorette";

function splitRugsack(rugsack: string): string[] {
	const halfSize = rugsack.length * 0.5;
	return [rugsack.slice(0, halfSize), rugsack.slice(halfSize, rugsack.length)];
}

function getItemPriorityList(): PriorityList {
	const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const list = alphabet.split("").map((char, key) => ({ char, priority: key + 1 }));
	const map: PriorityList = {};

	list.forEach((item) => (map[item.char] = item.priority));

	return map;
}

function getDuplicate(compartments: string[]) {
	const [compOne, compTwo] = compartments;
	const itemsCompOne = compOne.split("");
	const itemsCompTwo = compTwo.split("");

	return itemsCompOne.find((item) => itemsCompTwo.includes(item))!;
}

async function run() {
	const dataFile = join(srcDir, "..", "data", "2022", "day3", "rugsack.txt");
	const file = await readFile(dataFile, { encoding: "utf8" });

	const rugsacks = file.split("\n");
	const compartments = rugsacks.map(splitRugsack);
	const duplicates = compartments.map(getDuplicate);

	const priorityList = getItemPriorityList();
	const sumOfPriorities = duplicates.map((duplicate) => priorityList[duplicate]).reduce((a, b) => a + b, 0);

	console.log(`The sum of priorities of the duplicate items is ${bold(sumOfPriorities)}`);
}

void run();

interface PriorityList {
	[key: string]: number;
}
