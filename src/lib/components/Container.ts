import { getInputData } from "../utils.js";

export abstract class Container {
	/** The directory path */
	public readonly dirname: string;

	/** The year this assignment was released */
	public readonly year: string;

	/** The day this assignment was released */
	public readonly day: string;

	/** The name of the input data file */
	public readonly filename: string;

	/**
	 * @param filename The name of the input file
	 */
	public constructor(filename: string, dirname: string) {
		this.dirname = dirname;
		this.filename = filename;

		const locationData = this.getFileLocationData();
		this.year = locationData.year;
		this.day = locationData.day;
	}

	public async run(): Promise<void> {
		try {
			const input = await getInputData(this.year, this.day, this.filename);
			if (!input) return;

			await this.execute(input);
		} catch (error) {
			console.log(`An error occured while running ${this.year}/${this.day}: `, error);
		}
	}

	/**
	 * Parses the dirname in order to get the year and day
	 */
	protected getFileLocationData() {
		const [day, year] = this.dirname.split(/\//g).reverse();

		return {
			day: day.split(".")[0],
			year
		};
	}

	/**
	 * The logic of this class
	 * @param input The input for this assignment
	 */
	protected execute(input: string): Promise<void> | void {
		input;
	}
}
