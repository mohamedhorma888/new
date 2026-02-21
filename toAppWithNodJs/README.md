# To-Do List Backend

A simple RESTful API for managing to-do tasks, built with Node.js core modules only.

## Features

- ✅ **CRUD Operations**: Create, Read, Update, Delete tasks
- 🎯 **RESTful Design**: Proper HTTP methods and status codes
- 🔒 **Validation**: Input validation for all requests
- 📦 **In-Memory Storage**: Tasks stored in a JavaScript array
- 🚀 **No External Dependencies**: Uses only Node.js core modules

## Task Structure

Each task object contains:

```json
{
  "id": 1,
  "title": "Buy groceries",
  "completed": false,
  "createdAt": "2026-02-21T10:30:00.000Z",
  "updatedAt": "2026-02-21T10:35:00.000Z"
}
```

## Getting Started

### Prerequisites

- Node.js (v12 or higher)

### Installation

```bash
npm install
```

### Running the Server

```bash
npm start
```

Server will start on `http://127.0.0.1:3000`

## API Endpoints

### 1. Get All Tasks

**Request:**
```bash
GET /tasks
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "title": "Buy groceries",
      "completed": false,
      "createdAt": "2026-02-21T10:30:00.000Z"
    },
    {
      "id": 2,
      "title": "Complete project",
      "completed": true,
      "createdAt": "2026-02-21T10:32:00.000Z"
    }
  ]
}
```

---

### 2. Get a Specific Task

**Request:**
```bash
GET /tasks/1
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Buy groceries",
    "completed": false,
    "createdAt": "2026-02-21T10:30:00.000Z"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Task with id 999 not found",
  "status": 404
}
```

---

### 3. Create a New Task

**Request:**
```bash
POST /tasks
Content-Type: application/json

{
  "title": "Buy groceries"
}
```

**Optional fields:**
- `completed` (boolean, default: false)

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": 1,
    "title": "Buy groceries",
    "completed": false,
    "createdAt": "2026-02-21T10:30:00.000Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Title is required and must be a non-empty string",
  "status": 400
}
```

---

### 4. Update a Task

**Request:**
```bash
PUT /tasks/1
Content-Type: application/json

{
  "title": "Buy groceries and cook",
  "completed": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "id": 1,
    "title": "Buy groceries and cook",
    "completed": true,
    "createdAt": "2026-02-21T10:30:00.000Z",
    "updatedAt": "2026-02-21T10:35:00.000Z"
  }
}
```

---

### 5. Delete a Task

**Request:**
```bash
DELETE /tasks/1
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Task deleted successfully",
  "data": {
    "id": 1,
    "title": "Buy groceries",
    "completed": false,
    "createdAt": "2026-02-21T10:30:00.000Z"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "error": "Task with id 999 not found",
  "status": 404
}
```

---

## Testing with cURL

Here are example commands to test the API:

### Get all tasks
```bash
curl -X GET http://127.0.0.1:3000/tasks
```

### Create a task
```bash
curl -X POST http://127.0.0.1:3000/tasks \
  -H "Content-Type: application/json" \
  -d "{\"title\": \"Learn Node.js\"}"
```

### Create a task with completed status
```bash
curl -X POST http://127.0.0.1:3000/tasks \
  -H "Content-Type: application/json" \
  -d "{\"title\": \"Buy groceries\", \"completed\": false}"
```

### Get a specific task
```bash
curl -X GET http://127.0.0.1:3000/tasks/1
```

### Update a task
```bash
curl -X PUT http://127.0.0.1:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d "{\"completed\": true}"
```

### Delete a task
```bash
curl -X DELETE http://127.0.0.1:3000/tasks/1
```

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200  | OK - Request succeeded |
| 201  | Created - Resource created successfully |
| 400  | Bad Request - Invalid input or malformed request |
| 404  | Not Found - Resource doesn't exist |
| 405  | Method Not Allowed - HTTP method not supported for endpoint |
| 500  | Internal Server Error - Server error |

---

## Features Implemented

✅ **RESTful Design**
- Proper use of HTTP methods (GET, POST, PUT, DELETE)
- Meaningful URIs for resources

✅ **Request Handling**
- Parse JSON request bodies
- Handle streaming data correctly
- Support for Content-Type headers

✅ **Validation**
- Title validation (required, non-empty string)
- Completed status validation (must be boolean)
- Input sanitization (trim whitespace)

✅ **Response Handling**
- Consistent JSON response format
- Proper HTTP status codes
- Error messages with context

✅ **Error Handling**
- 404 for missing resources
- 400 for invalid input
- 405 for unsupported methods
- 500 for server errors

✅ **In-Memory Storage**
- Array-based storage with auto-incrementing IDs
- No external database required

---

## Code Structure

The server implements:

1. **Request Parsing**: `parseBody()` - Handles JSON body parsing with error handling
2. **Response Helpers**: `sendResponse()` and `sendError()` - Standardized response format
3. **Validation**: `validateTask()` - Input validation logic
4. **Route Handlers**: Individual functions for each endpoint
5. **Main Server Loop**: HTTP server with route matching and method handling

---

## Notes

- Tasks are stored in memory and will be reset when the server restarts
- IDs are auto-incremented and sequential
- CORS headers are enabled for browser requests
- Timestamps are in ISO 8601 format
