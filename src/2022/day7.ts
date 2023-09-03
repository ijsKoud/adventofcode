import { bold } from "colorette";
import { Container } from "../lib/components/Container.js";
import { fileURLToPath } from "node:url";

class FileSystemDirectory {
	public files: Map<string, number> = new Map();
	public directories: Map<string, FileSystemDirectory> = new Map();

	public parent: FileSystemDirectory | undefined;
	public name: string;

	public get size(): number {
		const files = [...this.files.values()].reduce((a, b) => a + b, 0);
		const directories = [...this.directories.values()].map((dir) => dir.size).reduce((a, b) => a + b, 0);

		return files + directories;
	}

	public constructor(name: string, parent?: FileSystemDirectory) {
		this.name = name;
		this.parent = parent;
	}

	/**
	 * Creates a new directory in this directory
	 * @param name The name of the directory
	 */
	public createDirectory(name: string) {
		const dir = new FileSystemDirectory(name, this);
		this.directories.set(name, dir);
	}

	/**
	 * Creates a new file in this directory
	 * @param name The name of the file
	 * @param size The size of the file
	 */
	public createFile(name: string, size: number) {
		this.files.set(name, size);
	}

	/**
	 * Gets or creates a directory with the provided name
	 * @param name The name of the directory
	 */
	public getOrCreate(name: string) {
		if (name === "..") return this.parent!;

		const dir = this.directories.get(name);
		if (dir) return dir;

		const newDir = new FileSystemDirectory(name, this);
		this.directories.set(name, newDir);

		return newDir;
	}

	/**
	 * Renders the file system structure into human readable format
	 * @param indentation
	 * @returns
	 */
	public render(indentation = 0): string {
		const files = [...this.files.entries()];
		const directories = [...this.directories.values()];

		return [
			`${"  ".repeat(indentation)}- ${this.name} (dir, size=${this.size})`,
			...directories.map((dir) => dir.render(indentation + 1)),
			...files.map(([fileName, fileSize]) => `${"  ".repeat(indentation + 1)}- ${fileName} (file, size=${fileSize})`)
		].join("\n");
	}

	public *walkDirectories(): Generator<FileSystemDirectory> {
		yield this;

		for (const directory of this.directories.values()) {
			yield* directory.walkDirectories();
		}
	}
}

class FileSystem extends Container {
	public constructor() {
		super("terminal.txt", fileURLToPath(import.meta.url));
	}

	protected override execute(input: string): void {
		const lines = input.split("\n");
		const fileSystem = this.createFileSystem(lines);

		const partOne = [...fileSystem.walkDirectories()]
			.map((dir) => dir.size)
			.filter((size) => size <= 1e5)
			.reduce((a, b) => a + b);

		const sizeUnused = 7e7 - fileSystem.size;
		const sizeNeeded = 3e7 - sizeUnused;
		const partTwo = [...fileSystem.walkDirectories()]
			.map((dir) => dir.size)
			.sort((a, b) => b - a)
			.filter((size) => size >= sizeNeeded)
			.sort((a, b) => a - b);

		console.log(`PartOne: The sum of the total sizes of the directories is ${bold(partOne)}.`);
		console.log(`The directory that should be deleted has a size of ${bold(partTwo[0])}.`);
	}

	private createFileSystem(lines: string[]) {
		const root = new FileSystemDirectory("/");
		let cwd = root;

		for (const line of lines) {
			const [c1, c2, c3] = line.split(/ +/g);
			if (c1 === "$") {
				if (c2 === "ls") continue;
				if (c3 === "/") {
					cwd = root;
					continue;
				}

				cwd = cwd.getOrCreate(c3);
				continue;
			}

			if (c1 === "dir") {
				cwd.createDirectory(c2);
				continue;
			}
			cwd.createFile(c2, Number(c1));
		}

		return root;
	}
}

const instance = new FileSystem();
void instance.run();
