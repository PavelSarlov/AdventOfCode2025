import { chain } from "lodash-es";
import { getLines, transpose } from "../lib/helpers.js";

const input = getLines("./input.txt", { trim: false });

const problems = transpose(
  input.map((line, i, arr) =>
    line
      .trim()
      .split(/\s+/g)
      .map((x) => (i < arr.length - 1 ? Number(x) : x)),
  ),
);

function evalProblem(problem, op) {
  return problem.reduce((x, y) => eval(`${x}${op}${y}`));
}

function part1() {
  return chain(problems)
    .map((line) =>
      evalProblem(line.slice(0, line.length - 1), line[line.length - 1]),
    )
    .sum()
    .value();
}

function part2() {
  const numbers = input.slice(0, input.length - 1);
  const ops = input[input.length - 1].trim().split(/\s+/g);
  const len = Math.max(...numbers.map((line) => line.length));
  return chain(
    transpose(
      numbers.map(
        (line) =>
          line +
          Array(len - line.length)
            .fill(" ")
            .join(""),
      ),
    ),
  )
    .map((line) => Number.parseInt(line.join("").trim() || undefined))
    .reduce(
      (acc, num) => {
        isNaN(num) ? (acc[acc.length] = []) : acc[acc.length - 1].push(num);
        return acc;
      },
      [[]],
    )
    .filter((line) => line.length)
    .map((line, i) => evalProblem(line, ops[i]))
    .sum()
    .value();
}

console.log(part1());
console.log(part2());
