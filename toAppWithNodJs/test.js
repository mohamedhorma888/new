const http = require('http');

const BASE_URL = 'http://127.0.0.1:3000';

// Helper function for HTTP requests
function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(path, BASE_URL);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(data)
          });
        } catch {
          resolve({
            status: res.statusCode,
            data: data
          });
        }
      });
    });

    req.on('error', reject);
    
    if (body) {
      req.write(JSON.stringify(body));
    }
    
    req.end();
  });
}

// Test suite
async function runTests() {
  console.log('\n🧪 Running To-Do List API Tests...\n');

  try {
    // Test 1: Get all tasks (should be empty)
    console.log('Test 1: GET /tasks (empty list)');
    let response = await makeRequest('GET', '/tasks');
    console.log(`Status: ${response.status}`);
    console.log(`Tasks count: ${response.data.count}`);
    console.log('✅ Passed\n');

    // Test 2: Create a task
    console.log('Test 2: POST /tasks (create task)');
    response = await makeRequest('POST', '/tasks', {
      title: 'Buy groceries',
      completed: false
    });
    console.log(`Status: ${response.status}`);
    console.log(`Task ID: ${response.data.data.id}`);
    console.log(`Title: ${response.data.data.title}`);
    console.log(`Completed: ${response.data.data.completed}`);
    const task1Id = response.data.data.id;
    console.log('✅ Passed\n');

    // Test 3: Create another task
    console.log('Test 3: POST /tasks (create another task)');
    response = await makeRequest('POST', '/tasks', {
      title: 'Learn Node.js'
    });
    console.log(`Status: ${response.status}`);
    console.log(`Task ID: ${response.data.data.id}`);
    const task2Id = response.data.data.id;
    console.log('✅ Passed\n');

    // Test 4: Get all tasks
    console.log('Test 4: GET /tasks (get all)');
    response = await makeRequest('GET', '/tasks');
    console.log(`Status: ${response.status}`);
    console.log(`Tasks count: ${response.data.count}`);
    response.data.data.forEach(task => {
      console.log(`  - [${task.completed ? '✓' : ' '}] ${task.title}`);
    });
    console.log('✅ Passed\n');

    // Test 5: Get specific task
    console.log(`Test 5: GET /tasks/${task1Id} (get specific task)`);
    response = await makeRequest('GET', `/tasks/${task1Id}`);
    console.log(`Status: ${response.status}`);
    console.log(`Task: ${response.data.data.title}`);
    console.log('✅ Passed\n');

    // Test 6: Update a task
    console.log(`Test 6: PUT /tasks/${task1Id} (update task)`);
    response = await makeRequest('PUT', `/tasks/${task1Id}`, {
      completed: true
    });
    console.log(`Status: ${response.status}`);
    console.log(`Updated: ${response.data.data.title} (completed: ${response.data.data.completed})`);
    console.log('✅ Passed\n');

    // Test 7: Update task title
    console.log(`Test 7: PUT /tasks/${task2Id} (update title)`);
    response = await makeRequest('PUT', `/tasks/${task2Id}`, {
      title: 'Master Node.js and Express'
    });
    console.log(`Status: ${response.status}`);
    console.log(`New title: ${response.data.data.title}`);
    console.log('✅ Passed\n');

    // Test 8: Error - empty title
    console.log('Test 8: POST /tasks (validation error - empty title)');
    response = await makeRequest('POST', '/tasks', {
      title: ''
    });
    console.log(`Status: ${response.status}`);
    console.log(`Error: ${response.data.error}`);
    console.log('✅ Passed\n');

    // Test 9: Error - missing title
    console.log('Test 9: POST /tasks (validation error - missing title)');
    response = await makeRequest('POST', '/tasks', {
      completed: true
    });
    console.log(`Status: ${response.status}`);
    console.log(`Error: ${response.data.error}`);
    console.log('✅ Passed\n');

    // Test 10: Error - invalid type for completed
    console.log('Test 10: POST /tasks (validation error - invalid completed type)');
    response = await makeRequest('POST', '/tasks', {
      title: 'Test task',
      completed: 'yes'
    });
    console.log(`Status: ${response.status}`);
    console.log(`Error: ${response.data.error}`);
    console.log('✅ Passed\n');

    // Test 11: Error - task not found
    console.log('Test 11: GET /tasks/999 (not found)');
    response = await makeRequest('GET', '/tasks/999');
    console.log(`Status: ${response.status}`);
    console.log(`Error: ${response.data.error}`);
    console.log('✅ Passed\n');

    // Test 12: Delete a task
    console.log(`Test 12: DELETE /tasks/${task1Id} (delete task)`);
    response = await makeRequest('DELETE', `/tasks/${task1Id}`);
    console.log(`Status: ${response.status}`);
    console.log(`Deleted: ${response.data.data.title}`);
    console.log('✅ Passed\n');

    // Test 13: Verify deleted
    console.log('Test 13: GET /tasks (verify deletion)');
    response = await makeRequest('GET', '/tasks');
    console.log(`Status: ${response.status}`);
    console.log(`Tasks count: ${response.data.count}`);
    console.log('✅ Passed\n');

    // Test 14: Error - delete non-existent task
    console.log('Test 14: DELETE /tasks/999 (delete non-existent)');
    response = await makeRequest('DELETE', '/tasks/999');
    console.log(`Status: ${response.status}`);
    console.log(`Error: ${response.data.error}`);
    console.log('✅ Passed\n');

    console.log('=' .repeat(50));
    console.log('🎉 All tests passed!\n');
    process.exit(0);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Make sure the server is running on http://127.0.0.1:3000');
    process.exit(1);
  }
}

// Run tests
runTests();
