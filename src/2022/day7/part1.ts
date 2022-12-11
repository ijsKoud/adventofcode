import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { srcDir } from "../../lib/constants.js";
import { getProperty, setProperty, deepKeys } from "dot-prop";
import { bold } from "colorette";

function getFileSystem(output: string) {
	let currentDir: string | undefined;
	let structure: FileStructure = { _files: 0 };
	const lines = output.split("\n");

	const updateCurrentDir = (p3: string) => {
		switch (p3) {
			case "..":
				{
					const dirs = currentDir ? currentDir.replaceAll(".", "/") : "/";
					const newDir = join(dirs, "..").replaceAll("/", ".");
					currentDir = newDir === "." ? undefined : newDir;
				}
				break;
			case "/":
				currentDir = undefined;
				break;
			default:
				currentDir = currentDir ? `${currentDir}.${p3}` : p3;
				break;
		}
	};

	const addDir = (p2: string) => {
		if (currentDir) {
			const existingData = getProperty(structure, currentDir) as FileStructure;
			setProperty(structure, currentDir, { ...existingData, [p2]: { _files: 0 } });
		} else structure = { ...structure, [p2]: { _files: 0 } };
	};

	const addFile = (p1: string) => {
		if (currentDir) {
			const dir = `${currentDir}._files`;
			const size = getProperty(structure, dir, 0) as number;
			setProperty(structure, dir, size + Number(p1));
		} else structure._files += Number(p1);
	};

	for (const line of lines) {
		const [p1, p2, p3] = line.split(" ");
		if (p1 === "$" && p2 === "cd") updateCurrentDir(p3);
		else if (p1 === "dir") addDir(p2);
		else if (!isNaN(Number(p1))) addFile(p1);
	}

	return structure;
}

function getTotalSize(fileSystem: FileStructure) {
	const sizeTable: SizeTable = {};
	const dKeys = deepKeys(fileSystem).map((key) => key.replace("._files", ""));
	const deepToClose = dKeys.sort((a, b) => b.split(".").length - a.split(".").length);

	for (const key of deepToClose) {
		if (key === "_files") {
			const keys = Object.keys(sizeTable);
			let size = fileSystem._files;

			for (const k of keys) {
				if (k.includes(".")) continue;
				size += sizeTable[k];
			}

			sizeTable[""] = size;

			continue;
		}

		const content = getProperty(fileSystem, key);
		const keys = Object.keys(content);
		let size = (content as FileStructure)._files;

		for (const k of keys) {
			if (k === "_files") continue;
			const vSize = sizeTable[`${key}.${k}`];
			size += vSize;
		}

		sizeTable[key] = size;
	}

	return sizeTable;
}

async function run() {
	const dataFile = join(srcDir, "..", "data", "2022", "day7", "terminal.txt");
	const file = await readFile(dataFile, { encoding: "utf8" });

	const cleanLines = file.replaceAll("$ ls\n", "");
	const fileSystem = getFileSystem(cleanLines);
	const sizeTable = getTotalSize(fileSystem);
	const validSizes = Object.keys(sizeTable)
		.map((key) => sizeTable[key])
		.filter((size) => size <= 1e5);

	console.log(`The sum of the total sizes of the directories is ${bold(validSizes.reduce((a, b) => a + b, 0))}.`);
}

void run();

interface FileStructure {
	_files: number;
	[key: string]: number | FileStructure;
}

interface SizeTable {
	[dir: string]: number;
}
