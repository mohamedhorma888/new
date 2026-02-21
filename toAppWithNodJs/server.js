const http = require('http');
const url = require('url');
const { parse } = require('querystring');

const PORT = 3000;
const HOST = '127.0.0.1';

// In-memory storage for tasks
let tasks = [];
let nextId = 1;

// Helper function to parse JSON body from request
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(new Error('Invalid JSON format'));
      }
    });
    req.on('error', reject);
  });
}

// Helper function to send JSON responses
function sendResponse(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

// Helper function to send error responses
function sendError(res, statusCode, message) {
  sendResponse(res, statusCode, {
    error: message,
    status: statusCode
  });
}

// Validate task data
function validateTask(data) {
  const errors = [];
  
  if (!data.title || typeof data.title !== 'string' || data.title.trim() === '') {
    errors.push('Title is required and must be a non-empty string');
  }
  
  if (data.completed !== undefined && typeof data.completed !== 'boolean') {
    errors.push('Completed must be a boolean');
  }
  
  return errors;
}

// GET /tasks - Get all tasks
function getAllTasks(res) {
  sendResponse(res, 200, {
    success: true,
    count: tasks.length,
    data: tasks
  });
}

// GET /tasks/:id - Get a specific task
function getTaskById(res, id) {
  const taskId = parseInt(id, 10);
  const task = tasks.find(t => t.id === taskId);
  
  if (!task) {
    sendError(res, 404, `Task with id ${taskId} not found`);
    return;
  }
  
  sendResponse(res, 200, {
    success: true,
    data: task
  });
}

// POST /tasks - Create a new task
async function createTask(req, res) {
  try {
    const body = await parseBody(req);
    
    // Validate input
    const errors = validateTask(body);
    if (errors.length > 0) {
      sendError(res, 400, errors.join('; '));
      return;
    }
    
    // Create new task
    const newTask = {
      id: nextId++,
      title: body.title.trim(),
      completed: body.completed || false,
      createdAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    
    sendResponse(res, 201, {
      success: true,
      message: 'Task created successfully',
      data: newTask
    });
  } catch (err) {
    sendError(res, 400, err.message);
  }
}

// PUT /tasks/:id - Update a task
async function updateTask(req, res, id) {
  try {
    const taskId = parseInt(id, 10);
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) {
      sendError(res, 404, `Task with id ${taskId} not found`);
      return;
    }
    
    const body = await parseBody(req);
    
    // Validate input
    if (Object.keys(body).length === 0) {
      sendError(res, 400, 'Request body cannot be empty');
      return;
    }
    
    const errors = validateTask({
      title: body.title !== undefined ? body.title : tasks[taskIndex].title,
      completed: body.completed !== undefined ? body.completed : tasks[taskIndex].completed
    });
    
    if (errors.length > 0) {
      sendError(res, 400, errors.join('; '));
      return;
    }
    
    // Update task
    if (body.title !== undefined) {
      tasks[taskIndex].title = body.title.trim();
    }
    if (body.completed !== undefined) {
      tasks[taskIndex].completed = body.completed;
    }
    tasks[taskIndex].updatedAt = new Date().toISOString();
    
    sendResponse(res, 200, {
      success: true,
      message: 'Task updated successfully',
      data: tasks[taskIndex]
    });
  } catch (err) {
    sendError(res, 400, err.message);
  }
}

// DELETE /tasks/:id - Delete a task
function deleteTask(res, id) {
  const taskId = parseInt(id, 10);
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  
  if (taskIndex === -1) {
    sendError(res, 404, `Task with id ${taskId} not found`);
    return;
  }
  
  const deletedTask = tasks.splice(taskIndex, 1)[0];
  
  sendResponse(res, 200, {
    success: true,
    message: 'Task deleted successfully',
    data: deletedTask
  });
}

// Create HTTP server
const server = http.createServer(async (req, res) => {
  // Enable CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Parse URL
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;
  
  // Route matching pattern: /tasks or /tasks/:id
  const taskMatch = pathname.match(/^\/tasks(?:\/(\d+))?$/);
  
  if (!taskMatch) {
    sendError(res, 404, 'Route not found');
    return;
  }
  
  const taskId = taskMatch[1];
  
  try {
    // GET /tasks - Get all tasks
    if (method === 'GET' && !taskId) {
      getAllTasks(res);
    }
    // GET /tasks/:id - Get specific task
    else if (method === 'GET' && taskId) {
      getTaskById(res, taskId);
    }
    // POST /tasks - Create task
    else if (method === 'POST' && !taskId) {
      await createTask(req, res);
    }
    // PUT /tasks/:id - Update task
    else if (method === 'PUT' && taskId) {
      await updateTask(req, res, taskId);
    }
    // DELETE /tasks/:id - Delete task
    else if (method === 'DELETE' && taskId) {
      deleteTask(res, taskId);
    }
    // Method not allowed
    else {
      sendError(res, 405, `Method ${method} not allowed for this endpoint`);
    }
  } catch (err) {
    sendError(res, 500, 'Internal server error');
    console.error('Error:', err);
  }
});

// Start server
server.listen(PORT, HOST, () => {
  console.log(`\n✅ To-Do List Server is running`);
  console.log(`   Host: ${HOST}`);
  console.log(`   Port: ${PORT}`);
  console.log(`   URL: http://${HOST}:${PORT}\n`);
  console.log('Available endpoints:');
  console.log('  GET    /tasks       - Get all tasks');
  console.log('  GET    /tasks/:id   - Get a specific task');
  console.log('  POST   /tasks       - Create a new task');
  console.log('  PUT    /tasks/:id   - Update a task');
  console.log('  DELETE /tasks/:id   - Delete a task\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n🛑 Server shutting down...');
  server.close(() => {
    console.log('✋ Server closed');
    process.exit(0);
  });
});
