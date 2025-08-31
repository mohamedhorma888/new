let queue = [];
        queue.push("A"); // Add to end
        queue.push("B");
        console.log("Queue after pushes:", queue); 
        let dequeued = queue.shift(); // Remove from beginning
        console.log("Dequeued element:", dequeued); 
        console.log("Queue after shift:", queue); 