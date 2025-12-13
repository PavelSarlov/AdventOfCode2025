import { chain, orderBy } from "lodash-es";
import { getLines } from "../lib/helpers.js";

const input = getLines("./input.txt").map((line) => {
  const [lights, ...buttons] = line.split(" ");
  const [joltage] = buttons.splice(buttons.length - 1);

  return {
    lightPattern: lights
      .replaceAll(/[\[\]]/g, "")
      .split("")
      .map((x) => (x === "#" ? 1 : 0)),
    buttons: buttons.map((button) =>
      button
        .replaceAll(/[\(\)]/g, "")
        .split(",")
        .map((x) => Number(x)),
    ),
    joltage: joltage
      .replaceAll(/[\{\}]/g, "")
      .split(",")
      .map((x) => Number(x)),
  };
});

function pressButtonLights(button, lights) {
  button.forEach((x) => (lights[x] = (lights[x] + 1) % 2));
}
function pressButtonJoltage(button, joltage) {
  button.forEach((x) => joltage[x]--);
}

function getCombinations(arr) {
  const result = [[]];

  for (const item of arr) {
    const len = result.length;
    for (let i = 0; i < len; i++) {
      result.push([...result[i], item]);
    }
  }

  return result;
}

function part1() {
  return chain(input)
    .map(({ buttons, lightPattern }) => {
      const combinations = orderBy(getCombinations(buttons), (x) => x.length);

      for (const combination of combinations) {
        const lights = lightPattern.slice();

        for (const button of combination) {
          pressButtonLights(button, lights);
        }

        if (lights.every((x) => !(x & 1))) {
          return combination.length;
        }
      }
    })
    .sum()
    .value();
}

function part2() {
  const solveOdd = (buttons, initJoltage, cache) => {
    if (initJoltage.every((x) => x === 0)) {
      return 0;
    }

    const combinations = orderBy(getCombinations(buttons), (x) => x.length);

    let min = Infinity;
    for (const combination of combinations) {
      const joltage = initJoltage.slice();

      for (const button of combination) {
        pressButtonJoltage(button, joltage);
      }

      if (joltage.some((x) => x < 0)) {
        continue;
      }

      if (joltage.every((x) => !(x & 1))) {
        const newJoltage = joltage.map((x) => x / 2);
        const joltageKey = JSON.stringify(newJoltage);

        const next =
          cache.get(joltageKey) ?? solveOdd(buttons, newJoltage, cache);
        cache.set(joltageKey, next);

        min = Math.min(min, combination.length + 2 * next);
      }
    }

    return min;
  };

  return chain(input)
    .map(({ buttons, joltage: initialJoltage }) =>
      solveOdd(buttons, initialJoltage, new Map()),
    )
    .sum()
    .value();
}

console.log(part1());
console.log(part2());
