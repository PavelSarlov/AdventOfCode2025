import JsGraphs from "js-graph-algorithms";
import { chain } from "lodash-es";
import { getLines } from "../lib/helpers.js";

const input = chain(getLines("./input.txt"))
  .map((line) => {
    const [device, outputs] = line.split(": ");

    return { [device]: outputs.split(" ") };
  })
  .reduce((acc, x) => ({ ...acc, ...x }), {})
  .value();

const verts = chain(Object.entries(input))
  .flatMap(([v1, outs]) => [v1, ...outs.map((v2) => v2)])
  .uniq()
  .value();
const vertsIndices = verts.reduce((acc, v, i) => acc.set(v, i), new Map());
const edges = Object.entries(input).flatMap(([v1, outs]) =>
  outs.map((v2) => [v1, v2]),
);

const graph = new JsGraphs.DiGraph(verts.length);
edges.forEach(([v1, v2]) =>
  graph.addEdge(vertsIndices.get(v1), vertsIndices.get(v2)),
);
const topoOrder = new JsGraphs.TopologicalSort(graph);

function countPaths(from, to) {
  const ways = Array(verts.length + 1).fill(0);
  ways[vertsIndices.get(from)] = 1;

  for (const node of topoOrder.order()) {
    for (const neighbor of graph.adj(node)) {
      ways[neighbor] += ways[node];
    }
  }

  return ways[vertsIndices.get(to)];
}

function part1() {
  return countPaths("you", "out");
}

function part2() {
  const svrfft = countPaths("svr", "fft");
  const svrdac = countPaths("svr", "dac");

  const fftdac = countPaths("fft", "dac");
  const dacfft = countPaths("dac", "fft");

  const dacout = countPaths("dac", "out");
  const fftout = countPaths("fft", "out");

  return svrfft * fftdac * dacout + svrdac * dacfft * fftout;
}

console.log(part1());
console.log(part2());
