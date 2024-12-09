import path from "node:path";
import fs from "node:fs/promises";

const getData = async () => {
  const input = path.resolve(__dirname, "input.txt");

  const file = await fs.readFile(input, "utf-8");

  return file.trim();
};

const splitStringEveryTwoChars = (data: string): string[] => {
  const result = [];
  for (let i = 0; i < data.length; i += 2) {
    result.push(data.slice(i, i + 2));
  }
  return result;
};

const FREE_SPACE_TOKEN = ".";
type FileSystem = (number | typeof FREE_SPACE_TOKEN)[];

const expandInput = (blocks: string[]): FileSystem =>
  blocks.reduce((acc, block, id) => {
    const [size, freeSpace] = block.split("");
    return [
      ...acc,
      ...Array(Number(size)).fill(id),
      ...(freeSpace ? Array(Number(freeSpace)).fill(FREE_SPACE_TOKEN) : []),
    ];
  }, [] as FileSystem);

const moveLastBlockToFreeSpace = (
  fileSystem: FileSystem,
  freeSpace: number
): FileSystem => {
  for (let i = fileSystem.length - 1; i >= 0; i--) {
    if (fileSystem[i] !== FREE_SPACE_TOKEN) {
      const block = fileSystem[i];
      fileSystem[i] = FREE_SPACE_TOKEN;
      fileSystem[freeSpace] = block;
      return fileSystem;
    }
  }

  throw new Error("No blocks to move");
};

const condenseFileSystem = (fileSystem: FileSystem): FileSystem => {
  let indexOfFirstFreeSpace = fileSystem.indexOf(FREE_SPACE_TOKEN);

  while (
    fileSystem.slice(indexOfFirstFreeSpace).some((v) => v !== FREE_SPACE_TOKEN)
  ) {
    moveLastBlockToFreeSpace(fileSystem, indexOfFirstFreeSpace);
    indexOfFirstFreeSpace = fileSystem.indexOf(FREE_SPACE_TOKEN);
  }

  return fileSystem;
};

const computeChecksum = (fileSystem: FileSystem): number =>
  fileSystem.reduce<number>(
    (total, value, index) =>
      value === FREE_SPACE_TOKEN ? total : total + value * index,
    0
  );

const main = async () => {
  const data = await getData();
  const blockDescriptions = splitStringEveryTwoChars(data);
  const fileSystem = expandInput(blockDescriptions);

  const condensedFileSystem = condenseFileSystem(fileSystem);

  const checksum = computeChecksum(condensedFileSystem);
  console.log(checksum);
};

main();
