import { bold } from "colorette";
import { Container } from "../lib/components/Container.js";
import { fileURLToPath } from "node:url";

class CampCleanup extends Container {
	public constructor() {
		super("cleanup-segments.txt", fileURLToPath(import.meta.url));
	}

	protected override execute(input: string): void {
		function partOneCheckGroup(groups: number[][]): boolean {
			const [groupOne, groupTwo] = groups;
			if (groupOne.every((int) => groupTwo.includes(int))) return true;
			if (groupTwo.every((int) => groupOne.includes(int))) return true;

			return false;
		}

		function partTwoCheckGroup(groups: number[][]): boolean {
			const [groupOne, groupTwo] = groups;
			if (groupOne.some((int) => groupTwo.includes(int))) return true;
			if (groupTwo.some((int) => groupOne.includes(int))) return true;

			return false;
		}

		const segments = input.split("\n");
		const segmentGroups = segments.map((segment) => segment.split(",").map((group) => this.segmentArray(group)));

		const partOne = segmentGroups.filter(partOneCheckGroup);
		const partTwo = segmentGroups.filter(partTwoCheckGroup);
		console.log(`PartOne: There are ${bold(partOne.length)} segments overlapping each other.`);
		console.log(`PartTwo: There are ${bold(partTwo.length)} segments overlapping each other.`);
	}

	/**
	 * Parses the input data and transforms it into an array of numbers
	 * @param segment The segment from the input
	 * @returns
	 */
	private segmentArray(segment: string): number[] {
		const [startStr, endStr] = segment.split("-");
		const start = Number(startStr);
		const end = Number(endStr);
		const length = end - start + 1;

		return Array(length)
			.fill(null)
			.map((_, k) => k + start);
	}
}

const instance = new CampCleanup();
void instance.run();
