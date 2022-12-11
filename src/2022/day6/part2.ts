import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { srcDir } from "../../lib/constants.js";
import { bold } from "colorette";

function getFirstMessageMarker(message: string) {
	const messageLength = message.length;

	for (let index = 14; index < messageLength; index++) {
		const messageSegment = message.slice(index - 14, index);
		const characters = messageSegment.split("");

		const dupIndex = new Set(characters).size === 14;
		if (!dupIndex) continue;

		return index;
	}

	return null;
}

async function run() {
	const dataFile = join(srcDir, "..", "data", "2022", "day6", "packets.txt");
	const file = await readFile(dataFile, { encoding: "utf8" });
	const firstMessageMarker = getFirstMessageMarker(file);
	if (!firstMessageMarker) throw new Error("expected number but received undefined");

	console.log(`${bold(firstMessageMarker)} needs to be processed before the first start-of-message marker is received.`);
}

void run();
