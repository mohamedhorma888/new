function dijkstra(graph, start) {
    const distances = {};
    const visited = new Set();
    const vertices = Object.keys(graph);
    
    // Initialize distances
    for (let vertex of vertices) {
        distances[vertex] = Infinity;
    }
    distances[start] = 0;
    
    while (visited.size < vertices.length) {
        // Find unvisited node with smallest distance
        let minDistance = Infinity;
        let minVertex = null;
        for (let vertex of vertices) {
            if (!visited.has(vertex) && distances[vertex] < minDistance) {
                minDistance = distances[vertex];
                minVertex = vertex;
            }
        }
        
        if (minVertex === null) break; // all remaining are infinity
        
        visited.add(minVertex);
        
        // Update neighbors
        for (let neighbor in graph[minVertex]) {
            const weight = graph[minVertex][neighbor];
            const newDistance = distances[minVertex] + weight;
            if (newDistance < distances[neighbor]) {
                distances[neighbor] = newDistance;
            }
        }
    }
    
    return distances;
}

// Test
const graph = {
    'A': { 'B': 4, 'C': 2 },
    'B': { 'A': 4, 'C': 5, 'D': 10 },
    'C': { 'A': 2, 'B': 5, 'D': 3 },
    'D': { 'B': 10, 'C': 3 }
};

console.log(dijkstra(graph, 'A'));
