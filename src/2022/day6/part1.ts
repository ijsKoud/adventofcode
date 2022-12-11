import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { srcDir } from "../../lib/constants.js";
import { bold } from "colorette";

function getFirstPacketMarker(packet: string) {
	const packetLength = packet.length;

	for (let index = 4; index < packetLength; index++) {
		const packetSegment = packet.slice(index - 4, index);
		const characters = packetSegment.split("");

		const dupIndex = new Set(characters).size === 4;
		if (!dupIndex) continue;

		return index;
	}

	return null;
}

async function run() {
	const dataFile = join(srcDir, "..", "data", "2022", "day6", "packets.txt");
	const file = await readFile(dataFile, { encoding: "utf8" });
	const firstPacketMarker = getFirstPacketMarker(file);
	if (!firstPacketMarker) throw new Error("expected number but received undefined");

	console.log(`${bold(firstPacketMarker)} needs to be processed before the first start-of-packet marker is received.`);
}

void run();
