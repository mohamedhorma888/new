# Secure Task Manager REST API

A production-ready Task Manager REST API with JWT authentication, Google OAuth, and comprehensive security features.

## Features

✅ **Authentication**
- JWT-based login/signup with HTTP-only secure cookies
- Google OAuth 2.0 integration using Passport.js
- Rate limiting on authentication endpoints
- Secure password hashing with bcryptjs

✅ **Task Management**
- Create, read, update, and delete tasks
- Ownership-based access control
- Filter tasks by status and priority
- Sort tasks by creation date or due date

✅ **Security Best Practices**
- Helmet.js for HTTP header security
- XSS protection with xss-clean
- NoSQL injection prevention with express-mongo-sanitize
- CORS-ready architecture
- Rate limiting on all endpoints
- Input validation and sanitization

✅ **Error Handling**
- Centralized error-handling middleware
- AppError utility class for consistent error responses
- Async error catching with catchAsync wrapper
- Detailed error messages in development mode

✅ **Data Validation**
- Email format validation
- Password strength requirements
- Task field validation
- MongoDB schema validation

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Google OAuth credentials (optional, for Google OAuth)

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd secure-task-manager
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Configure your environment variables:
```
# MongoDB URI
MONGODB_URI=mongodb://localhost:27017/secure-task-manager

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_in_production_12345678
JWT_EXPIRE=7d
COOKIE_EXPIRE=7

# Server Configuration
PORT=5000
NODE_ENV=development

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback

# Cookie Configuration
COOKIE_SECURE=false
COOKIE_HTTP_ONLY=true
COOKIE_SAME_SITE=strict
```

5. Start the server:
```bash
npm run dev
```

## API Endpoints

### Health Check
```
GET /health
```

### Authentication

#### Sign Up
```
POST /auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "passwordConfirm": "password123"
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Logout
```
POST /auth/logout
Authorization: Bearer <token>
```

#### Get Current User
```
GET /auth/me
Authorization: Bearer <token>
```

#### Google OAuth
```
GET /auth/google
```

Redirects to Google login. After authentication, redirects to `/auth/google/callback` which returns JWT token.

### Tasks

#### Create Task
```
POST /tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the REST API",
  "priority": "high",
  "dueDate": "2024-03-15"
}
```

#### Get All Tasks (with filters)
```
GET /tasks
Authorization: Bearer <token>

Query Parameters:
- status: pending, in-progress, completed
- priority: low, medium, high
- sortBy: createdAt (default), dueDate, priority
```

Example:
```
GET /tasks?status=pending&priority=high&sortBy=dueDate
```

#### Get Single Task
```
GET /tasks/:id
Authorization: Bearer <token>
```

#### Update Task
```
PUT /tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "in-progress",
  "priority": "medium"
}
```

#### Delete Task
```
DELETE /tasks/:id
Authorization: Bearer <token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

## Authentication

The API uses JWT tokens for authentication. Tokens can be sent in two ways:

1. **As HTTP-only Cookie** (recommended):
   - Automatically set during login
   - Automatically sent with requests

2. **As Bearer Token in Authorization Header**:
   ```
   Authorization: Bearer <token>
   ```

## Security Features Explained

### 1. Password Security
- Passwords are hashed using bcryptjs with salt rounds of 10
- Password comparison is done securely without exposing hashes
- Passwords are never returned in API responses

### 2. JWT Authentication
- Tokens expire after the configured JWT_EXPIRE duration
- Tokens are stored in HTTP-only cookies to prevent XSS attacks
- Token verification fails on expiration or tampering

### 3. Access Control
- Only authenticated users can access protected routes
- Users can only access/modify their own tasks
- 403 Forbidden returned if user tries to access other's tasks

### 4. Data Sanitization
- All input is sanitized against NoSQL injection attacks
- XSS attacks are prevented with xss-clean middleware
- MongoDB operators in input are removed

### 5. Rate Limiting
- Login/signup endpoints: 5 requests per 15 minutes
- General endpoints: 100 requests per hour

### 6. HTTP Headers
- Helmet.js sets secure HTTP headers
- Prevents clickjacking, XSS, and other header-based attacks

## Error Handling

The API uses a centralized error-handling system:

1. **AppError Class**: Custom error class for application-specific errors
2. **catchAsync Wrapper**: Wraps async route handlers to catch errors
3. **Error Handler Middleware**: Centralized error processing and response

### Common HTTP Status Codes
- 200: Success
- 201: Created
- 400: Bad Request (validation error)
- 401: Unauthorized (authentication error)
- 403: Forbidden (access denied)
- 404: Not Found
- 500: Internal Server Error

## Project Structure

```
secure-task-manager/
├── models/
│   ├── User.js           # User schema and methods
│   └── Task.js           # Task schema
├── controllers/
│   ├── authController.js # Authentication logic
│   └── taskController.js # Task CRUD operations
├── routes/
│   ├── authRoutes.js     # Authentication endpoints
│   └── taskRoutes.js     # Task endpoints
├── middleware/
│   ├── verifyToken.js    # JWT verification
│   └── errorHandler.js   # Error handling
├── utils/
│   ├── appError.js       # Custom error class
│   └── catchAsync.js     # Async error wrapper
├── config/
│   ├── database.js       # MongoDB connection
│   └── passport.js       # Passport configuration
├── app.js                # Express app setup
├── package.json          # Dependencies
└── .env.example          # Environment variables template
```

## Testing the API

### Using cURL

1. **Sign Up**:
```bash
curl -X POST http://localhost:5000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "passwordConfirm": "password123"
  }'
```

2. **Login**:
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }' -c cookies.txt
```

3. **Create Task**:
```bash
curl -X POST http://localhost:5000/tasks \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title": "My First Task",
    "description": "This is a test task",
    "priority": "high"
  }'
```

4. **Get Tasks**:
```bash
curl http://localhost:5000/tasks -b cookies.txt
```

### Using Postman

1. Import the API endpoints into Postman
2. Use the "Cookie" option to manage JWT tokens
3. Send requests to each endpoint with proper headers

## Google OAuth Setup

To enable Google OAuth:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URIs:
   - `http://localhost:5000/auth/google/callback`
6. Copy Client ID and Client Secret to `.env`

## Production Deployment

For production deployment:

1. **Environment Variables**:
   - Set `NODE_ENV=production`
   - Use strong JWT_SECRET
   - Enable `COOKIE_SECURE=true` (requires HTTPS)
   - Update MongoDB URI to production database

2. **HTTPS**:
   - Deploy behind a reverse proxy (nginx, Cloudflare)
   - Enable HTTPS for secure cookies

3. **Database**:
   - Use MongoDB Atlas or managed database
   - Enable authentication and IP whitelisting

4. **Monitoring**:
   - Set up error logging (Sentry, LogRocket)
   - Monitor rate limits and performance

## License

MIT

## Support

For issues or questions, please create an issue in the repository.
