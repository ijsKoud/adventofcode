/*
per groups of 3 (3 rugsacks) 1 common item
1 duplicate per group (item in all 3 rugsacks)

a-z -> 1-26
A-Z -> 27-52
*/

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { srcDir } from "../../lib/constants.js";
import { bold } from "colorette";

function getGroups(rugsacks: string[]): string[][] {
	const groupSize = 3;
	const groups: string[][] = [];

	for (let i = 0; i < rugsacks.length; i += groupSize) {
		groups.push(rugsacks.slice(i, i + groupSize));
	}

	return groups;
}

function getItemPriorityList(): PriorityList {
	const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const list = alphabet.split("").map((char, key) => ({ char, priority: key + 1 }));
	const map: PriorityList = {};

	list.forEach((item) => (map[item.char] = item.priority));

	return map;
}

function getDuplicate(rugsacks: string[]): string {
	const [one, two, three] = rugsacks;
	const splitOne = one.split("");
	const duplicateOneTwo = splitOne.filter((item) => two.includes(item));
	const duplicateOneThree = splitOne.filter((item) => three.includes(item));
	const duplicates = duplicateOneTwo.find((item) => duplicateOneThree.includes(item));

	return duplicates!;
}

async function run() {
	const dataFile = join(srcDir, "..", "data", "2022", "day3", "rugsack.txt");
	const file = await readFile(dataFile, { encoding: "utf8" });

	const rugsacks = file.split("\n");
	const groups = getGroups(rugsacks);
	const duplicates = groups.map(getDuplicate);

	const priorityList = getItemPriorityList();
	const sumOfPriorities = duplicates.map((duplicate) => priorityList[duplicate]).reduce((a, b) => a + b, 0);

	console.log(`The sum of priorities of the badges is ${bold(sumOfPriorities)}`);
}

void run();

interface PriorityList {
	[key: string]: number;
}
