# React Debugging Sample Application

A complete React application designed for learning and practicing debugging techniques using React Developer Tools. The application includes multiple components with intentional bugs that can be diagnosed and fixed using developer tools.

## Quick Start

### Prerequisites
- Node.js 14+ and npm installed
- A modern web browser (Chrome or Firefox)
- React Developer Tools extension installed

### Installation & Running

```bash
# Install dependencies
npm install

# Start the development server
npm start

# The app will open automatically at http://localhost:3000
```

### Installing React Developer Tools

**Chrome:**
1. Go to [Chrome Web Store - React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
2. Click "Add to Chrome"
3. Open DevTools (F12) and look for the "Components" tab

**Firefox:**
1. Go to [Firefox Add-ons - React Developer Tools](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)
2. Click "Add to Firefox"
3. Open DevTools (F12) and look for the "Inspector" > "Components" tab

---

## Application Components

### 1. Counter Component (`src/components/Counter.js`)
**Demonstrates:** State management, input validation, conditional rendering

**Features:**
- Increment/decrement counter
- Set custom increment value
- Reset functionality
- Warning messages for invalid values

**Known Issues to Debug:**
- ❌ No validation on increment input (allows negative/huge values)
- ❌ Warning threshold too high (1000 instead of reasonable limit)
- ❌ Reset doesn't reset increment value

### 2. User Profile Component (`src/components/UserProfile.js`)
**Demonstrates:** State management, CRUD operations, list handling

**Features:**
- User selection from dropdown
- Edit user information
- Delete users from list
- Display current user details

**Known Issues to Debug:**
- ❌ No validation after user deletion
- ❌ Type mismatch: age stored as string instead of number
- ❌ Deleted user reference can remain selected

### 3. Todo List Component (`src/components/TodoList.js`)
**Demonstrates:** List rendering, key reconciliation, state updates

**Features:**
- Add new todos
- Mark todos as complete
- Delete todos
- Display completion statistics

**Known Issues to Debug:**
- ❌ Non-unique ID generation (can create duplicate IDs)
- ❌ React key warnings in console
- ❌ List rendering issues with duplicate keys

### 4. Todo Item Component (`src/components/TodoItem.js`)
**Demonstrates:** Props handling, child components, event callbacks

**Features:**
- Display todo with title and status
- Toggle completion status
- Delete functionality

**Known Issues to Debug:**
- ❌ Props not properly destructured
- ❌ No prop validation

---

## Debugging Guide

See [DEBUGGING_GUIDE.md](DEBUGGING_GUIDE.md) for:
- Detailed issue descriptions
- Step-by-step debugging procedures
- How to use React Developer Tools effectively
- Solutions and code fixes
- Testing procedures

---

## Architecture

```
src/
├── App.js              # Main app component (orchestrator)
├── App.css             # Global styles
├── index.js            # React entry point
└── components/
    ├── Counter.js      # Counter component with state management
    ├── UserProfile.js  # User management component
    ├── TodoList.js     # Todo list container component
    └── TodoItem.js     # Individual todo item component

public/
└── index.html          # HTML template
```

---

## Key Learning Points

### 1. React Developer Tools
- Browse component hierarchy
- Inspect props and state in real-time
- Track state changes
- Identify component re-renders
- Use console integration ($r variable)

### 2. State Management
- Using useState hook correctly
- Preventing invalid state values
- Type consistency in state
- State updates after operations (deletion, etc.)

### 3. Props and Type Safety
- Proper props destructuring
- Type validation
- Passing data to child components
- Preventing prop-related errors

### 4. List Rendering
- Unique key requirements
- ID generation best practices
- List updates and reconciliation

### 5. Common React Bugs
- Missing input validation
- Type mismatches
- Duplicate keys in lists
- State not updating after operations
- Incorrect conditional logic

---

## Available Scripts

### Development
```bash
npm start
# Starts the dev server with hot-reload
# App runs on http://localhost:3000
```

### Production Build
```bash
npm run build
# Creates optimized production build
```

### Testing
```bash
npm test
# Runs test suite (if tests are added)
```

---

## Tips for Debugging

### Using React DevTools Console

1. **Inspect Current Component:**
   ```javascript
   $r  // Access the currently selected component instance
   ```

2. **View Props:**
   ```javascript
   $r.props  // See all props of current component
   ```

3. **View State:**
   ```javascript
   $r.state  // See current state (class components)
   // For hooks, state is not directly accessible via $r
   ```

4. **Call Component Methods:**
   ```javascript
   $r.runSomeMethod()  // Call methods directly
   ```

### Chrome DevTools Features

- **Profiler Tab:** Analyze performance and re-renders
- **Console Tab:** Check for warnings and errors
- **Network Tab:** Monitor API calls (if any)
- **Sources Tab:** Set breakpoints in your code

### Firefox DevTools

- **Inspector Tab:** Locate DOM elements
- **Console Tab:** Execute JavaScript
- **Storage Tab:** View localStorage, cookies, etc.

---

## Exercises

Try these debugging exercises to master React debugging:

### Exercise 1: Fix Counter Validation
**Objective:** Add proper input validation to prevent invalid increment values
- Hint: Look in Counter.js at handleIncrementByChange
- Constraints: Allow values 1-50 only

### Exercise 2: Fix User Deletion Bug
**Objective:** Prevent accessing deleted users
- Hint: Check UserProfile.js deleteUser function
- Solution: Reset selectedUserId to a valid user

### Exercise 3: Fix Duplicate ID Issue
**Objective:** Ensure all todos have unique IDs
- Hint: Math.random() based generation is unreliable
- Solution: Use Date.now() or a counter

### Exercise 4: Fix Type Mismatch
**Objective:** Ensure age is always a number
- Hint: Input returns strings, but user.age should be number
- Solution: Convert in updateUser function

---

## Troubleshooting

### App won't start
```bash
# Clear node_modules and reinstall
rm -r node_modules package-lock.json
npm install
npm start
```

### React DevTools not showing
1. Ensure extension is installed and enabled
2. Refresh the page (F5)
3. Check if it's a development build (React.js is not minified)

### Port 3000 already in use
```bash
# Use a different port
PORT=3001 npm start
```

### Hot-reload not working
1. Check if src/ files are saved properly
2. Restart the dev server
3. Clear browser cache (Ctrl+Shift+R)

---

## Resources

- [React Documentation](https://react.dev)
- [React DevTools on GitHub](https://github.com/facebook/react-devtools)
- [Chrome DevTools Guide](https://developer.chrome.com/docs/devtools/)
- [Firefox DevTools Guide](https://developer.mozilla.org/en-US/docs/Tools)

---

## Summary

This application provides a realistic debugging scenario with multiple components exhibiting common React issues. Use React Developer Tools to identify and fix these bugs, learning best practices for React development and debugging in the process.

**Happy Debugging! 🐛**
