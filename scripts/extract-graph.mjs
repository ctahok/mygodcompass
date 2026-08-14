// Quick probe: count nodes/terminals/edges via Node 24 native TS stripping
import { NODES, TERMINALS, buildEdges } from '../src/data/ontology.ts';
const nNodes = Object.keys(NODES).length;
const nTerm = Object.keys(TERMINALS).length;
const edges = buildEdges();
console.log(JSON.stringify({ nodes: nNodes, terminals: nTerm, edges: edges.length }, null, 2));
