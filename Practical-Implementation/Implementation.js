// Queue class implementation
class Queue {
    constructor() {
        this.items = [];
    }

    // Add an element to the end of the queue
    enqueue(element) {
        this.items.push(element);
    }

    // Remove and return the first element from the queue
    dequeue() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items.shift();
    }

    // Return the first element without removing it
    peek() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items[0];
    }

    // Check if the queue is empty
    isEmpty() {
        return this.items.length === 0;
    }

    // Get the size of the queue
    size() {
        return this.items.length;
    }
}

// PrinterQueue class using Queue
class PrinterQueue {
    constructor() {
        this.queue = new Queue();
    }

    // Add a print job to the queue
    addJob(name, pages) {
        const job = { name, pages };
        this.queue.enqueue(job);
        console.log(`Added job: ${name} - ${pages} pages`);
    }

    // Process the next job in the queue
    processJob() {
        if (this.queue.isEmpty()) {
            console.log("No jobs to process.");
            return;
        }
        const job = this.queue.dequeue();
        console.log(`Processing job: ${job.name} - ${job.pages} pages`);
    }

    // Print the current queue
    printQueue() {
        if (this.queue.isEmpty()) {
            console.log("Queue is empty.");
            return;
        }
        console.log("Current print queue:");
        let index = 1;
        for (let job of this.queue.items) {
            console.log(`${index}. ${job.name} - ${job.pages} pages`);
            index++;
        }
    }
}

// Test the implementation
const printerQueue = new PrinterQueue();

// Add some print jobs
printerQueue.addJob("Alice", 5);
printerQueue.addJob("Bob", 3);
printerQueue.addJob("Charlie", 10);

// Print the queue
printerQueue.printQueue();

// Process a job
printerQueue.processJob();

// Print the queue again
printerQueue.printQueue();

// Process another job
printerQueue.processJob();

// Print the queue
printerQueue.printQueue();

// Process the last job
printerQueue.processJob();

// Try to process when empty
printerQueue.processJob();
