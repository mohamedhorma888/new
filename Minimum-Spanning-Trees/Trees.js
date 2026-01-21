class UnionFind {
  constructor(size) {
    this.parent = Array.from({length: size}, (_, i) => i);
    this.rank = Array(size).fill(0);
  }

  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(x, y) {
    let px = this.find(x), py = this.find(y);
    if (px === py) return false;
    if (this.rank[px] < this.rank[py]) {
      this.parent[px] = py;
    } else if (this.rank[px] > this.rank[py]) {
      this.parent[py] = px;
    } else {
      this.parent[py] = px;
      this.rank[px]++;
    }
    return true;
  }
}

function kruskal(edges, numNodes) {
  edges.sort((a, b) => a[2] - b[2]);
  let uf = new UnionFind(numNodes);
  let mst = [];
  let totalCost = 0;
  for (let edge of edges) {
    let [u, v, w] = edge;
    if (uf.union(u, v)) {
      mst.push(edge);
      totalCost += w;
    }
  }
  return { mst, totalCost };
}

// Example usage
let edges = [
  [0, 1, 4],
  [0, 2, 3],
  [1, 2, 1],
  [1, 3, 2],
  [2, 3, 5]
];
let numNodes = 4;
let result = kruskal(edges, numNodes);
console.log("Selected connections (edges):", result.mst);
console.log("Total cost:", result.totalCost);

// Bonus: Allow user input to add nodes and weights dynamically
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let dynamicEdges = [];
let dynamicNumNodes = 0;

function askForNodes() {
  rl.question('Enter the number of computers (nodes): ', (answer) => {
    dynamicNumNodes = parseInt(answer);
    askForEdges();
  });
}

function askForEdges() {
  rl.question('Enter edge as u v w (or "done" to finish): ', (answer) => {
    if (answer.toLowerCase() === 'done') {
      let result = kruskal(dynamicEdges, dynamicNumNodes);
      console.log("Selected connections (edges):", result.mst);
      console.log("Total cost:", result.totalCost);
      rl.close();
    } else {
      let [u, v, w] = answer.split(' ').map(Number);
      dynamicEdges.push([u, v, w]);
      askForEdges();
    }
  });
}

askForNodes();
