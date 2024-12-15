import fs from "node:fs/promises";
import path from "node:path";

const getData = async () => {
  const input = path.resolve(__dirname, "input.txt");

  const file = await fs.readFile(input, "utf-8");

  return file.trim();
};

type Coordinate = {
  x: number;
  y: number;
};
type Robot = {
  position: Coordinate;
  vX: number;
  vY: number;
};

const GRID_WIDTH = 101;
const GRID_HEIGHT = 103;

const createRobots = (data: string): Robot[] =>
  data.split("\n").map((v) => {
    const [[pX, pY], [vX, vY]] = v
      .split(" ")
      .map((x) => x.split("=")[1].split(",").map(Number));

    return {
      position: { x: pX, y: pY },
      vX,
      vY,
    };
  });

const normalizeNumber = (n: number, max: number): number => {
  if (n < 0) {
    // with max of 11...
    // -1 should go to 10
    // -2 should go to 9
    return max - Math.abs(n);
  }

  if (n >= max) {
    // with max of 11...
    // 11 should go to 0
    // 12 should go to 1
    return n - max;
  }

  return n;
};

const moveRobot = (robot: Robot): Robot => {
  const { position, vX, vY } = robot;

  const newX = position.x + vX;
  const newY = position.y + vY;

  const newPosition = {
    x: normalizeNumber(newX, GRID_WIDTH),
    y: normalizeNumber(newY, GRID_HEIGHT),
  };

  return {
    ...robot,
    position: newPosition,
  };
};

const moveAllRobots100Times = async (robots: Robot[]) => {
  let newRobots = robots;

  for (let i = 1; i < 10_404; i++) {
    // for (let i = 1; i < 100; i++) {
    newRobots = newRobots.map(moveRobot);

    const grid = plotRobots(newRobots);

    if ((i - 50) % 103 === 0) {
      console.log(i);
      console.log(grid.map((row) => row.join("")).join("\n"));
    }
  }
};

const plotRobots = (robots: Robot[]) => {
  const grid: number[][] = new Array(GRID_HEIGHT)
    .fill(0)
    .map(() => new Array(GRID_WIDTH).fill(0));

  robots.forEach(({ position }) => {
    grid[position.y][position.x] = grid[position.y][position.x] + 1;
  });

  return grid.map((row) => row.map((v) => (v === 0 ? " " : `■`)));
};

const main = async () => {
  const data = await getData();
  const robots = createRobots(data);

  moveAllRobots100Times(robots);
};

main();
