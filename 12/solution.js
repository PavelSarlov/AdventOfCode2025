import { chain } from "lodash-es";
import { getLines } from "../lib/helpers.js";

const input = getLines("./example1.txt").reduce((acc, line) => {
  if (line.match(/^[\.#]+$/)) {
    acc.shapes[acc.shapes.length - 1].push(
      line.split("").map((x) => (x === "#" ? 1 : 0)),
    );

    return acc;
  }

  if (line.match(/^\d+:/)) {
    const shapes = acc.shapes ?? [];
    shapes[Number(line.split(":")[0])] = [];
    return { ...acc, shapes };
  }

  if (line.match(/\d+x\d+/)) {
    const regions = acc.regions ?? [];
    const [area, presents] = line.split(": ");
    regions.push({
      area: area
        .split("x")
        .map((x) => Number(x))
        .reduce((x, y) => x * y),
      presents: presents.split(" ").map((x) => Number(x)),
    });
    return { ...acc, regions };
  }

  return acc;
}, {});

const shapeAreas = input.shapes.map((shape) =>
  shape.reduce((a, r) => a + r.reduce((x, y) => x + y), 0),
);

function part1() {
  return chain(input.regions)
    .map(
      ({ area, presents }) =>
        area >=
        chain(presents)
          .map((x, i) => x * shapeAreas[i])
          .sum()
          .value(),
    )
    .sum()
    .value();
}

console.log(part1());
