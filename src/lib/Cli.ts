import { createInterface } from "node:readline";

export const cliInterface = createInterface({
	input: process.stdin,
	output: process.stdout
});
