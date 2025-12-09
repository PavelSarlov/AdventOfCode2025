import { chain } from "lodash-es";
import { getLines } from "../lib/helpers.js";

const input = getLines("./input.txt").map((line) =>
  line.split(",").map((x) => Number(x)),
);

function hashPoint(a) {
  return JSON.stringify(a);
}

function hashEdge(a, b) {
  return JSON.stringify([hashPoint(a), hashPoint(b)].sort());
}

function dist(a, b) {
  const [x1, y1, z1] = a;
  const [x2, y2, z2] = b;

  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2 + (z1 - z2) ** 2);
}

function getTopJunctions(edges) {
  const visitedRaw = new Set();
  const getJunctionSize = (a, visited) => {
    if (visited.has(a)) {
      return visited.size;
    }

    visited.add(a);
    visitedRaw.add(a);

    return Math.max(...[...edges[a]].map((b) => getJunctionSize(b, visited)));
  };

  return chain(Object.keys(edges))
    .map((a) => {
      const visited = new Set();
      return visitedRaw.has(a) ? 0 : getJunctionSize(a, visited);
    })
    .filter((x) => isFinite(x))
    .orderBy((x) => x, "desc")
    .slice(0, 3)
    .value();
}

function getEdges(connections) {
  const edges = input.reduce(
    (acc, p) => ({ ...acc, [hashPoint(p)]: new Set() }),
    {},
  );

  let distances = [];

  for (let i = 0; i < input.length; i++) {
    for (let j = i + 1; j < input.length; j++) {
      distances.push([hashEdge(input[i], input[j]), dist(input[i], input[j])]);
    }
  }

  distances = chain(distances)
    .sortBy(([, distance]) => distance)
    .value();

  while (connections--) {
    const [edge] = distances.shift();
    const [a, b] = JSON.parse(edge);
    const [x1] = JSON.parse(a);
    const [x2] = JSON.parse(b);

    edges[a].add(b);
    edges[b].add(a);

    if (
      connections === Infinity &&
      Object.values(edges).every((x) => x.size) &&
      getTopJunctions(edges)[0] === input.length
    ) {
      return x1 * x2;
    }
  }

  return edges;
}

function part1() {
  return getTopJunctions(getEdges(1000)).reduce((a, b) => a * b);
}

function part2() {
  return getEdges(Infinity);
}

console.log(part1());
console.log(part2());
