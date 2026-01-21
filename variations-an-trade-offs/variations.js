// Array-based Queue (Fixed size)
class ArrayBasedQueue {
    constructor(size) {
        this.size = size;
        this.queue = new Array(size);
        this.front = 0;
        this.rear = 0;
        this.count = 0;
    }

    enqueue(element) {
        if (this.count === this.size) {
            throw new Error("Queue is full");
        }
        this.queue[this.rear] = element;
        this.rear = (this.rear + 1) % this.size;
        this.count++;
    }

    dequeue() {
        if (this.isEmpty()) {
            throw new Error("Queue is empty");
        }
        const element = this.queue[this.front];
        this.front = (this.front + 1) % this.size;
        this.count--;
        return element;
    }

    isEmpty() {
        return this.count === 0;
    }

    peek() {
        if (this.isEmpty()) {
            throw new Error("Queue is empty");
        }
        return this.queue[this.front];
    }
}

// Linked List-based Queue (Dynamic size)
class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

class LinkedListBasedQueue {
    constructor() {
        this.front = null;
        this.rear = null;
    }

    enqueue(element) {
        const newNode = new Node(element);
        if (this.rear) {
            this.rear.next = newNode;
        }
        this.rear = newNode;
        if (!this.front) {
            this.front = newNode;
        }
    }

    dequeue() {
        if (this.isEmpty()) {
            throw new Error("Queue is empty");
        }
        const element = this.front.value;
        this.front = this.front.next;
        if (!this.front) {
            this.rear = null;
        }
        return element;
    }

    isEmpty() {
        return this.front === null;
    }

    peek() {
        if (this.isEmpty()) {
            throw new Error("Queue is empty");
        }
        return this.front.value;
    }
}

// Min-Heap-based Priority Queue
class MinHeapPriorityQueue {
    constructor() {
        this.heap = [];
    }

    insert(element) {
        this.heap.push(element);
        this._bubbleUp(this.heap.length - 1);
    }

    extractMin() {
        if (this.isEmpty()) {
            throw new Error("Priority queue is empty");
        }
        const min = this.heap[0];
        const last = this.heap.pop();
        if (this.heap.length > 0) {
            this.heap[0] = last;
            this._sinkDown(0);
        }
        return min;
    }

    peekMin() {
        if (this.isEmpty()) {
            throw new Error("Priority queue is empty");
        }
        return this.heap[0];
    }

    isEmpty() {
        return this.heap.length === 0;
    }

    _bubbleUp(index) {
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (this.heap[index].priority >= this.heap[parentIndex].priority) {
                break;
            }
            [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
            index = parentIndex;
        }
    }

    _sinkDown(index) {
        const length = this.heap.length;
        while (true) {
            let left = 2 * index + 1;
            let right = 2 * index + 2;
            let smallest = index;

            if (left < length && this.heap[left].priority < this.heap[smallest].priority) {
                smallest = left;
            }
            if (right < length && this.heap[right].priority < this.heap[smallest].priority) {
                smallest = right;
            }
            if (smallest === index) {
                break;
            }
            [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
            index = smallest;
        }
    }
}

// Ordered Array-based Priority Queue
class OrderedArrayPriorityQueue {
    constructor() {
        this.array = [];
    }

    insert(element) {
        // Find the position to insert
        let i = 0;
        while (i < this.array.length && this.array[i].priority <= element.priority) {
            i++;
        }
        this.array.splice(i, 0, element);
    }

    extractMin() {
        if (this.isEmpty()) {
            throw new Error("Priority queue is empty");
        }
        return this.array.shift();
    }

    peekMin() {
        if (this.isEmpty()) {
            throw new Error("Priority queue is empty");
        }
        return this.array[0];
    }

    isEmpty() {
        return this.array.length === 0;
    }
}

// Example usage (assuming elements for priority queue are {value, priority})
// const queue = new ArrayBasedQueue(5);
// queue.enqueue(1);
// console.log(queue.peek()); // 1
// console.log(queue.dequeue()); // 1

// const pq = new MinHeapPriorityQueue();
// pq.insert({value: 'a', priority: 3});
// pq.insert({value: 'b', priority: 1});
// console.log(pq.peekMin()); // {value: 'b', priority: 1}
// console.log(pq.extractMin()); // {value: 'b', priority: 1}
