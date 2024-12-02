
const readInput = require('../../utils/readInput');

const input = readInput(__dirname, 'input.txt');
const MAX_CHANGE = 3;

const safeReports = [];
const safeReportsDampened = [];
const unsafeReports = [];

function removeItem(report, index) {
  const array = [...report];
  array.splice(index, 1);
  return array;
}

function isSafe (report, { canUseDampener, isDampenerUsed }) {
  let direction = '';
  let diff;
  for (let j = 1; j < report.length; j++) {
    diff = report[j-1] - report[j];
    if (Math.abs(diff) > MAX_CHANGE
      || (direction === '+' && diff < 0)
      || (direction === '-' && diff > 0)
      || diff === 0) {
      // console.log(`${report} unsafe because ${diff} and ${direction}`)
      if (canUseDampener) {
        // console.log(`Checking safety by removing ${report[j-1]} or ${report[j]}`)
        return isSafe(removeItem(report, j-1), { canUseDampener: false, isDampenerUsed: true  })
          || isSafe(removeItem(report, j), { canUseDampener: false, isDampenerUsed: true })
          || isSafe(removeItem(report, j - 2), { canUseDampener: false, isDampenerUsed: true });
      }
      return false;
    }
    direction = diff > 0 ? '+' : '-';
  }
  // if(isDampenerUsed) {
  //   console.log(`${report} is safe after dampener`)
  // }
  return true;
}

input.split('\n').filter(l => !!l)
  .map((l) => {
    const report = l.split(' ').map(Number)
    isSafe(report, { canUseDampener: false }) ?
      safeReports.push(report) :
      isSafe(report, { canUseDampener: true }) ?
        safeReportsDampened.push(report) :
        unsafeReports.push(report);
    return report;
  });

console.log('part1', safeReports.length)
console.log('part2', safeReports.length + safeReportsDampened.length)
