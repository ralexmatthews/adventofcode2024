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

const reportWithoutIndex = (report: Report, index: number) =>
  report.filter((_, i) => i !== index);

const testReportWithoutIndexes = (report: Report) => {
  // we need to check if removing either the first or second value makes it valid
  return report.some((_, i) =>
    reportIsSafe(reportWithoutIndex(report, i), false)
  );
};

const reportIsSafe = (report: Report, canTolerateBadValue = true): boolean => {
  // if the first value of the report is the same as the second value
  // its not safe, so handle that case
  if (report[1] === report[0]) {
    if (canTolerateBadValue) {
      return canTolerateBadValue ? testReportWithoutIndexes(report) : false;
    }

    return false;
  }

  const isIncreasing = report[1] > report[0];
  const isDecreasing = report[1] < report[0];

  for (let i = 1; i < report.length; i++) {
    const diff = Math.abs(report[i] - report[i - 1]);
    if (diff > 3 || diff < 1) {
      return canTolerateBadValue ? testReportWithoutIndexes(report) : false;
    }

    if (isIncreasing && report[i] < report[i - 1]) {
      return canTolerateBadValue ? testReportWithoutIndexes(report) : false;
    }

    if (isDecreasing && report[i] > report[i - 1]) {
      return canTolerateBadValue ? testReportWithoutIndexes(report) : false;
    }
  }
  return true;
};

const getSafeReports = (reports: Report[]) =>
  reports.filter((report) => reportIsSafe(report)).length;

const main = async () => {
  const data = await getData();
  const reports = getReports(data);

  const numberOfSafeReports = getSafeReports(reports);

  console.log(numberOfSafeReports);
};

main();
