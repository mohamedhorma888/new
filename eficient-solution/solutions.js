// Task class to represent each task
class Task {
    constructor(name, startTime, endTime, priority) {
        this.name = name;
        this.startTime = startTime; // number, e.g., minutes since start of day
        this.endTime = endTime;
        this.priority = priority; // 'High', 'Medium', 'Low'
    }
}

// Example list of tasks
const tasks = [
    new Task('Task1', 100, 200, 'High'),
    new Task('Task2', 150, 250, 'Medium'),
    new Task('Task3', 300, 400, 'Low'),
    new Task('Task4', 180, 220, 'High'),
    new Task('Task5', 350, 450, 'Medium')
];

// Function to sort tasks by start time (efficiently)
// Time: O(n log n) due to sort
// Space: O(1) if in-place, but sort may use O(log n) stack
function sortTasksByStartTime(tasks) {
    return tasks.sort((a, b) => a.startTime - b.startTime);
}

// Function to group tasks by priority using Map for fast access
// Time: O(n)
// Space: O(n)
function groupTasksByPriority(tasks) {
    const groups = new Map();
    for (const task of tasks) {
        if (!groups.has(task.priority)) {
            groups.set(task.priority, []);
        }
        groups.get(task.priority).push(task);
    }
    return groups;
}

// Function to detect overlapping tasks
// Sort by start time, then check if current end > next start
// Time: O(n log n) for sort + O(n) for check
// Space: O(1) extra, assuming sort in-place
function detectOverlappingTasks(tasks) {
    const sorted = sortTasksByStartTime([...tasks]); // copy to avoid modifying original
    const overlaps = [];
    for (let i = 0; i < sorted.length - 1; i++) {
        if (sorted[i].endTime > sorted[i + 1].startTime) {
            overlaps.push([sorted[i], sorted[i + 1]]);
        }
    }
    return overlaps;
}

// Optional: Estimate memory usage
// Rough estimate: each task ~ 4 strings/numbers, assume 100 bytes per task
// Time: O(1)
// Space: O(1)
function estimateMemoryUsage(numTasks) {
    const bytesPerTask = 100; // rough estimate
    return numTasks * bytesPerTask;
}

// Example usage
console.log('Original tasks:', tasks);
console.log('Sorted by start time:', sortTasksByStartTime([...tasks]));
console.log('Grouped by priority:', groupTasksByPriority(tasks));
console.log('Overlapping tasks:', detectOverlappingTasks(tasks));
console.log('Estimated memory for 100 tasks:', estimateMemoryUsage(100));
