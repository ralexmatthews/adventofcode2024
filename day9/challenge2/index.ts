import path from "node:path";
import fs from "node:fs/promises";

const getData = async () => {
  const input = path.resolve(__dirname, "input.txt");

  const file = await fs.readFile(input, "utf-8");

  return file.trim();
};

const FREE_SPACE_TOKEN = ".";
type Block = {
  id: number | typeof FREE_SPACE_TOKEN;
  size: number;
};
type FileSystem = (number | typeof FREE_SPACE_TOKEN)[];

const splitStringEveryTwoChars = (data: string): string[] => {
  const result = [];
  for (let i = 0; i < data.length; i += 2) {
    result.push(data.slice(i, i + 2));
  }
  return result;
};

const createBlocks = (blocks: string[]): Block[] =>
  blocks.reduce<Block[]>((newBlocks, block, id) => {
    const [size, freeSpace] = block.split("");
    const nonFreeSpaceBlock = { id, size: Number(size) };
    return freeSpace
      ? [
          ...newBlocks,
          nonFreeSpaceBlock,
          { id: FREE_SPACE_TOKEN, size: Number(freeSpace) },
        ]
      : [...newBlocks, nonFreeSpaceBlock];
  }, []);

const defragBlocks = (blocks: Block[]): Block[] => {
  for (let i = blocks.length - 1; i >= 0; i--) {
    const blockInQuestion = blocks[i];

    if (blockInQuestion.id === FREE_SPACE_TOKEN) {
      continue;
    }

    const freeSpaceBlockIndex = blocks
      .slice(0, i)
      .findIndex(
        (block) =>
          block.id === FREE_SPACE_TOKEN && block.size >= blockInQuestion.size
      );

    if (freeSpaceBlockIndex !== -1) {
      const freeSpaceBlock = blocks[freeSpaceBlockIndex];

      blocks[freeSpaceBlockIndex] = blockInQuestion;
      blocks[i] = { id: FREE_SPACE_TOKEN, size: blockInQuestion.size };

      const freeSpaceLeftOver = freeSpaceBlock.size - blockInQuestion.size;

      if (freeSpaceLeftOver) {
        blocks.splice(freeSpaceBlockIndex + 1, 0, {
          id: FREE_SPACE_TOKEN,
          size: freeSpaceLeftOver,
        });
        i++;
      }
    }
  }

  return blocks;
};

const expandInput = (blocks: Block[]): FileSystem =>
  blocks.reduce(
    (acc, block) => [...acc, ...Array(Number(block.size)).fill(block.id)],
    [] as FileSystem
  );

const computeChecksum = (fileSystem: FileSystem): number =>
  fileSystem.reduce<number>(
    (total, value, index) =>
      value === FREE_SPACE_TOKEN ? total : total + value * index,
    0
  );

const main = async () => {
  const data = await getData();
  const blockDescriptions = splitStringEveryTwoChars(data);
  const blocks = createBlocks(blockDescriptions);

  const defraggedBlocks = defragBlocks(blocks);

  const expandedInput = expandInput(defraggedBlocks);

  const checksum = computeChecksum(expandedInput);

  console.log(checksum);

  // const fileSystem = expandInput(blockDescriptions);

  // const defraggedFileSystem = defragmentFileSystem(fileSystem);

  // const checksum = computeChecksum(defraggedFileSystem);
  // console.log(checksum);
};

main();
