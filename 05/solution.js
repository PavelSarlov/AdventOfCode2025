import { chain } from "lodash-es";
import { getLines } from "../lib/helpers.js";

const input = getLines("./input.txt").reduce(
  (acc, line) => ({
    ranges: [
      ...(acc.ranges ?? []),
      ...(line.match(/-/) ? [line.split("-").map((x) => Number(x))] : []),
    ],
    ids: [
      ...(acc.ids ?? []),
      ...(!line.match(/-/) ? [Number(line || undefined)] : []),
    ].filter((x) => !isNaN(x)),
  }),
  {},
);

input.ranges = chain(input.ranges)
  .orderBy(([s]) => s)
  .value();

function part1() {
  return input.ids.filter((id) =>
    input.ranges.some(([s, e]) => s <= id && id <= e),
  ).length;
}

function part2() {
  const combinedRanges = [];

  let changed = false;

  do {
    input.ranges.forEach(([s1, e1]) => {
      const overlapping = combinedRanges.findIndex(
        ([s2, e2]) => s1 <= e2 && s2 <= e1,
      );

      if (overlapping !== -1) {
        const [s2, e2] = combinedRanges[overlapping];
        combinedRanges[overlapping] = [Math.min(s1, s2), Math.max(e1, e2)];
      } else {
        combinedRanges.push([s1, e1]);
      }
    });
  } while (changed);

  return chain(combinedRanges)
    .map(([s, e]) => e - s + 1)
    .sum()
    .value();
}

console.log(part1());
console.log(part2());
