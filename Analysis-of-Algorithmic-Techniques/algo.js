// Brute-Force Algorithm using Dynamic Programming
function bruteForce(tasks) {
  // Sort tasks by end time
  tasks.sort((a, b) => a.end - b.end);
  const n = tasks.length;
  const dp = new Array(n).fill(0);
  const prev = new Array(n).fill(-1);

  for (let i = 0; i < n; i++) {
    dp[i] = 1; // at least itself
    for (let j = 0; j < i; j++) {
      if (tasks[j].end <= tasks[i].start && dp[j] + 1 > dp[i]) {
        dp[i] = dp[j] + 1;
        prev[i] = j;
      }
    }
  }

  // Find the max dp value and reconstruct the selected tasks
  let maxIndex = 0;
  for (let i = 1; i < n; i++) {
    if (dp[i] > dp[maxIndex]) maxIndex = i;
  }

  const selected = [];
  let current = maxIndex;
  while (current !== -1) {
    selected.unshift(tasks[current]);
    current = prev[current];
  }

  return selected;
}

// Greedy Algorithm
function greedy(tasks) {
  // Sort tasks by end time
  tasks.sort((a, b) => a.end - b.end);
  const selected = [];
  let currentEnd = -Infinity;

  for (const task of tasks) {
    if (task.start >= currentEnd) {
      selected.push(task);
      currentEnd = task.end;
    }
  }

  return selected;
}

// Sample input
const tasks = [
  { start: 1, end: 3 },
  { start: 2, end: 5 },
  { start: 4, end: 6 },
  { start: 6, end: 7 },
  { start: 5, end: 9 },
  { start: 8, end: 10 }
];

// Test both
console.log("Brute Force Result:");
const bfResult = bruteForce([...tasks]);
console.log(bfResult);
console.log("Count:", bfResult.length);

console.log("Greedy Result:");
const gResult = greedy([...tasks]);
console.log(gResult);
console.log("Count:", gResult.length);

// Function to generate random tasks
function generateRandomTasks(n) {
  const tasks = [];
  for (let i = 0; i < n; i++) {
    const start = Math.floor(Math.random() * 10000);
    const end = start + Math.floor(Math.random() * 100) + 1; // end > start
    tasks.push({ start, end });
  }
  return tasks;
}

// Time the greedy for large input
const largeTasks = generateRandomTasks(10000);
console.time("Greedy Large");
const largeResult = greedy(largeTasks);
console.timeEnd("Greedy Large");
console.log("Greedy Large Count:", largeResult.length);

// For brute force, since O(n^2), for 10000 it's 100M operations, might be slow but doable
// But to compare, perhaps time on smaller
const smallTasks = generateRandomTasks(1000);
console.time("Brute Force Small");
const smallBf = bruteForce(smallTasks);
console.timeEnd("Brute Force Small");
console.log("Brute Force Small Count:", smallBf.length);

console.time("Greedy Small");
const smallG = greedy(smallTasks);
console.timeEnd("Greedy Small");
console.log("Greedy Small Count:", smallG.length);