import path from "node:path";
import fs from "node:fs/promises";

const getData = async () => {
  const input = path.resolve(__dirname, "input.txt");

  const file = await fs.readFile(input, "utf-8");

  return file.trim();
};

type Report = number[];

const getReports = (data: string): Report[] =>
  data.split("\n").map((v) => v.split(/\s+/gim).map(Number));

const isAlwaysIncreasing = (report: Report) => {
  for (let i = 1; i < report.length; i++) {
    if (report[i] <= report[i - 1]) {
      return false;
    }
  }
  return true;
};
const isAlwaysDecreasing = (report: Report) => {
  for (let i = 1; i < report.length; i++) {
    if (report[i] >= report[i - 1]) {
      return false;
    }
  }
  return true;
};

const isConsistentDirection = (report: Report) =>
  isAlwaysDecreasing(report) || isAlwaysIncreasing(report);

const reportHasNoBigOrSmallJumps = (report: Report) => {
  for (let i = 1; i < report.length; i++) {
    const diff = Math.abs(report[i] - report[i - 1]);
    if (diff > 3 || diff < 1) {
      return false;
    }
  }
  return true;
};

const reportIsSafe = (report: Report) =>
  isConsistentDirection(report) && reportHasNoBigOrSmallJumps(report);

const getSafeReports = (reports: Report[]) =>
  reports.filter(reportIsSafe).length;

const main = async () => {
  const data = await getData();
  const reports = getReports(data);

  const numberOfSafeReports = getSafeReports(reports);

  console.log(numberOfSafeReports);
};

main();
