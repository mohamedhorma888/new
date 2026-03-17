const crypto = require('crypto');

// Consistent Hashing Ring
class HashRing {
    constructor(replicas = 3) {
        this.replicas = replicas;
        this.ring = new Map();
        this.sortedKeys = [];
        this.nodes = new Set();
    }

    addNode(nodeId) {
        if (this.nodes.has(nodeId)) return;
        this.nodes.add(nodeId);
        for (let i = 0; i < this.replicas; i++) {
            const hash = this.hash(`${nodeId}:${i}`);
            this.ring.set(hash, nodeId);
            this.sortedKeys.push(hash);
        }
        this.sortedKeys.sort();
    }

    removeNode(nodeId) {
        if (!this.nodes.has(nodeId)) return;
        this.nodes.delete(nodeId);
        for (let i = 0; i < this.replicas; i++) {
            const hash = this.hash(`${nodeId}:${i}`);
            this.ring.delete(hash);
            const index = this.sortedKeys.indexOf(hash);
            if (index > -1) this.sortedKeys.splice(index, 1);
        }
    }

    getNode(key) {
        if (this.sortedKeys.length === 0) return null;
        const hash = this.hash(key);
        const index = this.findNextNodeIndex(hash);
        return this.ring.get(this.sortedKeys[index]);
    }

    findNextNodeIndex(hash) {
        let low = 0, high = this.sortedKeys.length - 1;
        while (low <= high) {
            const mid = Math.floor((low + high) / 2);
            if (this.sortedKeys[mid] >= hash) {
                high = mid - 1;
            } else {
                low = mid + 1;
            }
        }
        return low % this.sortedKeys.length;
    }

    hash(key) {
        return parseInt(crypto.createHash('md5').update(key).digest('hex').substring(0, 8), 16);
    }

    getAllNodes() {
        return Array.from(this.nodes);
    }
}

// LRU Cache
class LRUCache {
    constructor(capacity = 100) {
        this.capacity = capacity;
        this.cache = new Map();
    }

    get(key) {
        if (!this.cache.has(key)) return null;
        const value = this.cache.get(key);
        this.cache.delete(key);
        this.cache.set(key, value);
        return value;
    }

    put(key, value) {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        } else if (this.cache.size >= this.capacity) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        this.cache.set(key, value);
    }

    delete(key) {
        this.cache.delete(key);
    }
}

// Node representing a microservice
class Node {
    constructor(id) {
        this.id = id;
        this.data = new Map(); // key -> value
        this.isAlive = true;
    }

    store(key, value) {
        this.data.set(key, value);
    }

    retrieve(key) {
        return this.data.get(key) || null;
    }

    delete(key) {
        return this.data.delete(key);
    }

    getAllData() {
        return Array.from(this.data.entries());
    }

    fail() {
        this.isAlive = false;
    }

    recover() {
        this.isAlive = true;
    }
}

// Main Microservices System
class MicroservicesSystem {
    constructor() {
        this.hashRing = new HashRing();
        this.nodes = new Map(); // nodeId -> Node
        this.cache = new LRUCache(50); // Cache with capacity 50
        this.nodeCounter = 0;
    }

    addNode() {
        const nodeId = `node-${++this.nodeCounter}`;
        const node = new Node(nodeId);
        this.nodes.set(nodeId, node);
        this.hashRing.addNode(nodeId);
        console.log(`Node ${nodeId} joined the system.`);
        this.redistributeData();
        return nodeId;
    }

    removeNode(nodeId) {
        if (!this.nodes.has(nodeId)) return;
        this.hashRing.removeNode(nodeId);
        const node = this.nodes.get(nodeId);
        const dataToMove = node.getAllData();
        this.nodes.delete(nodeId);
        console.log(`Node ${nodeId} left the system. Redistributing ${dataToMove.length} items.`);
        this.redistributeData(dataToMove);
    }

    redistributeData(additionalData = []) {
        const allData = [];
        // Collect all data from existing nodes
        for (const node of this.nodes.values()) {
            allData.push(...node.getAllData());
        }
        allData.push(...additionalData);

        // Clear all nodes
        for (const node of this.nodes.values()) {
            node.data.clear();
        }

        // Reassign data
        for (const [key, value] of allData) {
            const nodeId = this.hashRing.getNode(key);
            if (nodeId && this.nodes.has(nodeId)) {
                this.nodes.get(nodeId).store(key, value);
            }
        }
    }

    set(key, value) {
        const nodeId = this.hashRing.getNode(key);
        if (!nodeId || !this.nodes.has(nodeId) || !this.nodes.get(nodeId).isAlive) {
            throw new Error('No available node for key');
        }
        this.nodes.get(nodeId).store(key, value);
        this.cache.put(key, value); // Update cache
        console.log(`Stored ${key} on ${nodeId}`);
    }

    get(key) {
        // Check cache first
        let value = this.cache.get(key);
        if (value !== null) {
            console.log(`Cache hit for ${key}`);
            return value;
        }

        const nodeId = this.hashRing.getNode(key);
        if (!nodeId || !this.nodes.has(nodeId) || !this.nodes.get(nodeId).isAlive) {
            throw new Error('No available node for key');
        }
        value = this.nodes.get(nodeId).retrieve(key);
        if (value !== null) {
            this.cache.put(key, value); // Cache the result
        }
        console.log(`Retrieved ${key} from ${nodeId}`);
        return value;
    }

    delete(key) {
        const nodeId = this.hashRing.getNode(key);
        if (nodeId && this.nodes.has(nodeId) && this.nodes.get(nodeId).isAlive) {
            this.nodes.get(nodeId).delete(key);
        }
        this.cache.delete(key); // Remove from cache
        console.log(`Deleted ${key}`);
    }

    simulateFailure(nodeId) {
        if (this.nodes.has(nodeId)) {
            this.nodes.get(nodeId).fail();
            console.log(`Node ${nodeId} failed.`);
        }
    }

    recoverNode(nodeId) {
        if (this.nodes.has(nodeId)) {
            this.nodes.get(nodeId).recover();
            console.log(`Node ${nodeId} recovered.`);
            // In a real system, you'd need to sync data, but for simplicity, assume data is intact
        }
    }

    getStatus() {
        const status = {
            nodes: {},
            totalData: 0
        };
        for (const [id, node] of this.nodes) {
            status.nodes[id] = {
                alive: node.isAlive,
                dataCount: node.data.size
            };
            status.totalData += node.data.size;
        }
        return status;
    }
}

// Example usage and simulation
function runSimulation() {
    const system = new MicroservicesSystem();

    // Add initial nodes
    system.addNode(); // node-1
    system.addNode(); // node-2
    system.addNode(); // node-3

    // Load example data
    const data = [
        ['user:101', {"name": "Alice"}],
        ['user:102', {"name": "Bob"}],
        ['user:103', {"name": "Charlie"}],
        ['user:104', {"name": "Diana"}],
        ['user:105', {"name": "Eve"}],
        ['user:106', {"name": "Frank"}]
    ];

    console.log('\n--- Loading initial data ---');
    for (const [key, value] of data) {
        try {
            system.set(key, value);
        } catch (e) {
            console.log(`Failed to set ${key}: ${e.message}`);
        }
    }

    console.log('\n--- System status after loading data ---');
    console.log(system.getStatus());

    // Test retrieval
    console.log('\n--- Retrieving data ---');
    for (const [key] of data) {
        try {
            const value = system.get(key);
            console.log(`${key}: ${JSON.stringify(value)}`);
        } catch (e) {
            console.log(`Failed to get ${key}: ${e.message}`);
        }
    }

    // Add a new node
    console.log('\n--- Adding new node ---');
    system.addNode(); // node-4
    console.log(system.getStatus());

    // Remove a node
    console.log('\n--- Removing node-2 ---');
    system.removeNode('node-2');
    console.log(system.getStatus());

    // Simulate failure
    console.log('\n--- Simulating failure of node-1 ---');
    system.simulateFailure('node-1');
    console.log(system.getStatus());

    // Try to access data that might be on failed node
    console.log('\n--- Trying to access data after failure ---');
    for (const [key] of data) {
        try {
            const value = system.get(key);
            console.log(`${key}: ${JSON.stringify(value)}`);
        } catch (e) {
            console.log(`Failed to get ${key}: ${e.message}`);
        }
    }

    // Recover node
    console.log('\n--- Recovering node-1 ---');
    system.recoverNode('node-1');
    console.log(system.getStatus());
}

// Run the simulation if this file is executed directly
if (require.main === module) {
    runSimulation();
}

module.exports = { MicroservicesSystem, HashRing, LRUCache, Node };