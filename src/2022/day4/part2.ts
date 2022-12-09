/*
.234.....  2-4
.....678.  6-8

.23......  2-3
...45....  4-5

....567..  5-7
......789  7-9 // overlap

.2345678.  2-8
..34567..  3-7 // overlap

.....6...  6-6
...456...  4-6 // overlap

.23456...  2-6 // overlap
...45678.  4-8
*/

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { srcDir } from "../../lib/constants.js";
import { bold } from "colorette";

function segmentArray(segment: string): number[] {
	const [startStr, endStr] = segment.split("-");
	const start = Number(startStr);
	const end = Number(endStr);
	const length = end - start + 1;

	return Array(length)
		.fill(null)
		.map((_, k) => k + start);
}

function checkGroup(groups: number[][]): boolean {
	const [groupOne, groupTwo] = groups;
	if (groupOne.some((int) => groupTwo.includes(int))) return true;
	if (groupTwo.some((int) => groupOne.includes(int))) return true;

	return false;
}

async function run() {
	const dataFile = join(srcDir, "..", "data", "2022", "day4", "cleanup-segments.txt");
	const file = await readFile(dataFile, { encoding: "utf8" });

	const segments = file.split("\n");
	const segmentGroups = segments.map((segment) => segment.split(",").map((group) => segmentArray(group)));

	const count = segmentGroups.filter(checkGroup);
	console.log(`There are ${bold(count.length)} segments overlapping each other.`);
}

void run();
