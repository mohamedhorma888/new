const express = require('express');
const path = require('path');
const app = express();

// Set up the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (CSS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Custom middleware to verify working hours (Monday-Friday, 9-17)
const checkWorkingHours = (req, res, next) => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const hour = now.getHours();

  // Check if it's a weekday (Monday = 1 to Friday = 5)
  const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
  // Check if it's within working hours (9 to 17)
  const isWorkingHours = hour >= 9 && hour < 17;

  if (isWeekday && isWorkingHours) {
    next(); // Allow access
  } else {
    res.render('closed', {
      currentDay: now.toLocaleDateString('en-US', { weekday: 'long' }),
      currentTime: now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    });
  }
};

// Apply the middleware to all routes
app.use(checkWorkingHours);

// Routes
app.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

app.get('/services', (req, res) => {
  res.render('services', { title: 'Our Services' });
});

app.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact Us' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Available Monday-Friday, 9 AM - 5 PM');
});
