// ============================================
// Async/Await Tasks - Complete Solutions
// ============================================

// ============================================
// Task 01: Iterating with Async/Await
// ============================================
async function iterateWithAsyncAwait(values) {
  console.log("\n--- Task 01: Iterating with Async/Await ---");
  for (const value of values) {
    console.log(value);
    // Wait 1 second between logs
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  console.log("Iteration complete!");
}

// ============================================
// Task 02: Awaiting a Call
// ============================================
// Simulate an API call that returns data
function simulateAPICall(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 1000);
  });
}

async function awaitCall() {
  console.log("\n--- Task 02: Awaiting a Call ---");
  try {
    console.log("Fetching data from API...");
    const data = await simulateAPICall({ id: 1, name: "John Doe", email: "john@example.com" });
    console.log("Data received:", data);
  } catch (error) {
    console.error("Error in awaitCall:", error);
  }
}

// ============================================
// Task 03: Handling Errors with Async/Await
// ============================================
// Simulate an API call that may fail
function simulateAPICallWithError(shouldFail = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error("API request failed: Server returned 500"));
      } else {
        resolve({ id: 1, name: "Jane Doe", email: "jane@example.com" });
      }
    }, 1000);
  });
}

async function awaitCallWithErrorHandling(shouldFail = false) {
  console.log("\n--- Task 03: Handling Errors with Async/Await ---");
  try {
    console.log("Fetching data from API...");
    const data = await simulateAPICallWithError(shouldFail);
    console.log("Data received successfully:", data);
  } catch (error) {
    // User-friendly error message
    console.error("⚠️ We encountered an issue while fetching data. Please try again later.");
    console.error("Details:", error.message);
  }
}

// ============================================
// Task 04: Chaining Async/Await
// ============================================
async function asyncFunction1() {
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log("Function 1 completed");
  return "Result 1";
}

async function asyncFunction2() {
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log("Function 2 completed");
  return "Result 2";
}

async function asyncFunction3() {
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log("Function 3 completed");
  return "Result 3";
}

async function chainedAsyncFunctions() {
  console.log("\n--- Task 04: Chaining Async/Await ---");
  try {
    const result1 = await asyncFunction1();
    const result2 = await asyncFunction2();
    const result3 = await asyncFunction3();
    
    console.log("All functions completed successfully!");
    console.log("Chained Results:", { result1, result2, result3 });
  } catch (error) {
    console.error("Error in chained functions:", error);
  }
}

// ============================================
// Task 05: Awaiting Concurrent Requests
// ============================================
function apiCall1() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: 1, data: "Response from API 1" });
    }, 1500);
  });
}

function apiCall2() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: 2, data: "Response from API 2" });
    }, 1000);
  });
}

async function concurrentRequests() {
  console.log("\n--- Task 05: Awaiting Concurrent Requests ---");
  try {
    console.log("Making two API calls concurrently...");
    const startTime = Date.now();
    
    // Both requests run concurrently
    const [result1, result2] = await Promise.all([apiCall1(), apiCall2()]);
    
    const duration = Date.now() - startTime;
    console.log("Combined Results:", { result1, result2 });
    console.log(`Total time: ${duration}ms (both requests ran in parallel)`);
  } catch (error) {
    console.error("Error in concurrent requests:", error);
  }
}

// ============================================
// Task 06: Awaiting Parallel Calls
// ============================================
function fetchFromURL(url) {
  return new Promise((resolve) => {
    // Simulate fetching data with varying delays
    const delay = Math.random() * 2000 + 500; // 500-2500ms
    setTimeout(() => {
      resolve({ url, data: `Data from ${url}`, status: "success" });
    }, delay);
  });
}

async function parallelCalls(urls) {
  console.log("\n--- Task 06: Awaiting Parallel Calls ---");
  try {
    console.log(`Fetching data from ${urls.length} URLs concurrently...`);
    const startTime = Date.now();
    
    // Fetch all URLs concurrently
    const responses = await Promise.all(urls.map(url => fetchFromURL(url)));
    
    const duration = Date.now() - startTime;
    console.log("All responses received:");
    responses.forEach((response, index) => {
      console.log(`  ${index + 1}. ${response.url} - ${response.data}`);
    });
    console.log(`Total time: ${duration}ms (all requests ran in parallel)`);
  } catch (error) {
    console.error("Error in parallel calls:", error);
  }
}

// ============================================
// Main Execution
// ============================================
async function runAllTasks() {
  try {
    // Task 01: Iterating with Async/Await
    await iterateWithAsyncAwait(["Item 1", "Item 2", "Item 3"]);

    // Task 02: Awaiting a Call
    await awaitCall();

    // Task 03: Handling Errors - Success case
    await awaitCallWithErrorHandling(false);

    // Task 03: Handling Errors - Failure case
    await awaitCallWithErrorHandling(true);

    // Task 04: Chaining Async/Await
    await chainedAsyncFunctions();

    // Task 05: Awaiting Concurrent Requests
    await concurrentRequests();

    // Task 06: Awaiting Parallel Calls
    await parallelCalls([
      "https://api.example.com/users",
      "https://api.example.com/posts",
      "https://api.example.com/comments"
    ]);

    console.log("\n✅ All tasks completed successfully!");
  } catch (error) {
    console.error("Error during execution:", error);
  }
}

// Run all tasks
runAllTasks();
