import { bold } from "colorette";
import { Container } from "../lib/components/Container.js";
import { fileURLToPath } from "node:url";

class TuningTrouble extends Container {
	public constructor() {
		super("packets.txt", fileURLToPath(import.meta.url));
	}

	protected override execute(input: string): void {
		const firstPacketMarker = this.partOne(input);
		const firstMessageMarker = this.partTwo(input);
		console.log(`${bold(firstPacketMarker)} needs to be processed before the first start-of-packet marker is received.`);
		console.log(`${bold(firstMessageMarker)} needs to be processed before the first start-of-message marker is received.`);
	}

	/**
	 * The logic behind the solution for part 1
	 * @param input the data input
	 * @returns
	 */
	private partOne(input: string) {
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

		const firstPacketMarker = getFirstPacketMarker(input);
		if (!firstPacketMarker) throw new Error("expected number but received undefined");

		return firstPacketMarker;
	}

	/**
	 * The logic behind the solution for part 2
	 * @param input the data input
	 * @returns
	 */
	private partTwo(input: string) {
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

		const firstMessageMarker = getFirstMessageMarker(input);
		if (!firstMessageMarker) throw new Error("expected number but received undefined");

		return firstMessageMarker;
	}
}

const instance = new TuningTrouble();
void instance.run();
