import { join } from "node:path";
import { srcDir } from "./constants.js";
import { readFile } from "node:fs/promises";

/**
 * Returns the correct input data for the specified year, day and name
 * @param year The year to check
 * @param day The day to check
 * @param name The name of the file
 * @returns
 */
export async function getInputData(year: string, day: string, name: string) {
	try {
		const dataFile = join(srcDir, "..", "data", year, day, name);
		const file = await readFile(dataFile, { encoding: "utf8" });

		return file;
	} catch (error) {
		console.error(`An error occured while trying to read (data/${year}/${day}/${name}): `, error);
		return null;
	}
}
