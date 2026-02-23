# Quick Start Guide

## Prerequisites
- Node.js and npm installed on your system
- A terminal/command prompt

## Steps to Run

1. **Navigate to the project directory:**
   ```bash
   cd path\to\expressRouting
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   
   This will install:
   - `express` - The web framework
   - `ejs` - The template engine

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## Testing the Application

### During Working Hours (Monday-Friday, 9 AM - 5 PM)
- You will see the full website with all pages accessible
- Navigate between pages using the navigation bar

### Outside Working Hours
- You will see a "Currently Closed" message
- The middleware will prevent access to all pages
- The closed.ejs page shows current time and business hours

## Troubleshooting

### npm install fails with permission error
Try running with elevated permissions or use:
```bash
npm install --no-optional
```

### Port 3000 already in use
You can change the port in `app.js`:
```javascript
const PORT = process.env.PORT || 3000;  // Change 3000 to another port
```

Or set environment variable:
```bash
set PORT=3001
npm start
```

### Can't access the site
- Make sure the server is running (you should see a message)
- Check the correct URL: `http://localhost:3000`
- Check browser console for errors (F12)
