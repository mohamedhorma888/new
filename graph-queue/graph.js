class Graph {
  constructor(numVertices = 0, directed = false) {
    this.numVertices = numVertices;
    this.directed = directed;
    // adjacency list as an array of Sets for efficient add/remove/check
    this.adj = Array.from({ length: numVertices }, () => new Set());
  }

  _validateVertex(v) {
    if (v < 0 || v >= this.numVertices) {
      throw new Error(`Vertex ${v} is out of bounds (0..${this.numVertices - 1})`);
    }
  }

  addEdge(u, v) {
    this._validateVertex(u);
    this._validateVertex(v);
    this.adj[u].add(v);
    if (!this.directed) {
      this.adj[v].add(u);
    }
  }

  removeEdge(u, v) {
    this._validateVertex(u);
    this._validateVertex(v);
    this.adj[u].delete(v);
    if (!this.directed) {
      this.adj[v].delete(u);
    }
  }

  hasEdge(u, v) {
    this._validateVertex(u);
    this._validateVertex(v);
    return this.adj[u].has(v);
  }

  printGraph() {
    console.log(`Graph (numVertices=${this.numVertices}, directed=${this.directed})`);
    for (let i = 0; i < this.numVertices; i++) {
      const neighbors = Array.from(this.adj[i]).join(', ');
      console.log(`${i} -> ${neighbors}`);
    }
  }

  DFS(start) {
    this._validateVertex(start);
    const visited = new Array(this.numVertices).fill(false);
    const order = [];

    const dfsVisit = (u) => {
      visited[u] = true;
      order.push(u);
      // iterate neighbors in insertion order
      for (const v of this.adj[u]) {
        if (!visited[v]) dfsVisit(v);
      }
    };

    dfsVisit(start);
    console.log('DFS order:', order.join(' '));
    return order;
  }

  BFS(start) {
    this._validateVertex(start);
    const visited = new Array(this.numVertices).fill(false);
    const queue = [];
    const order = [];

    visited[start] = true;
    queue.push(start);

    while (queue.length > 0) {
      const u = queue.shift();
      order.push(u);
      for (const v of this.adj[u]) {
        if (!visited[v]) {
          visited[v] = true;
          queue.push(v);
        }
      }
    }

    console.log('BFS order:', order.join(' '));
    return order;
  }
}

// ------------------------
// Basic tests / usage
// ------------------------

// Undirected graph test (5 vertices)
const g = new Graph(5, false);
// edges: 0-1, 0-2, 1-2, 1-3, 3-4
g.addEdge(0, 1);
 g.addEdge(0, 2);
 g.addEdge(1, 2);
 g.addEdge(1, 3);
 g.addEdge(3, 4);

console.log('\n--- Undirected Graph ---');
g.printGraph();
console.log('Expect DFS from 0: 0 1 2 3 4');
g.DFS(0);
console.log('Expect BFS from 0: 0 1 2 3 4');
g.BFS(0);

// Directed graph test (4 vertices)
const dg = new Graph(4, true);
// edges: 0->1, 0->2, 1->2, 2->0, 2->3
dg.addEdge(0, 1);
dg.addEdge(0, 2);
dg.addEdge(1, 2);
dg.addEdge(2, 0);
dg.addEdge(2, 3);

console.log('\n--- Directed Graph ---');
dg.printGraph();
console.log('Expect DFS from 2: 2 0 1 3 (one possible valid order)');
dg.DFS(2);
console.log('Expect BFS from 2: 2 0 3 1 (depending on neighbor order)');
dg.BFS(2);

// Edge checks and removal
console.log('\nEdge checks:');
console.log('g.hasEdge(0,1) should be true:', g.hasEdge(0, 1));
console.log('g.hasEdge(1,4) should be false:', g.hasEdge(1, 4));

console.log('\nRemoving edge 1-3 and reprinting:');
g.removeEdge(1, 3);
g.printGraph();

// Export Graph for external use (if required)
module.exports = { Graph };
