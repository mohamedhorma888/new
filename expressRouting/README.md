# Express Routing Web Application

A multi-page web application built with Express.js that demonstrates routing, custom middleware, and server-side rendering with EJS templates.

## Features

✨ **Three Main Pages:**
- **Home Page** - Welcome page with feature showcase
- **Our Services** - Detailed service offerings
- **Contact Us** - Contact form and business information

🔐 **Working Hours Middleware:**
- Application is only accessible Monday to Friday, 9 AM - 5 PM
- Custom middleware checks the current time and day
- Shows a friendly "closed" page outside business hours

🎨 **Responsive Design:**
- Modern, gradient-based UI with CSS styling
- Mobile-friendly responsive layout
- Navigation bar on every page for easy access

## Project Structure

```
expressRouting/
├── app.js                 # Main Express server with middleware
├── package.json          # Project dependencies
├── views/
│   ├── index.ejs         # Home page
│   ├── services.ejs      # Services page
│   ├── contact.ejs       # Contact page
│   ├── closed.ejs        # Closed page (outside working hours)
│   └── layout.ejs        # Layout template
└── public/
    └── css/
        └── style.css     # Stylesheet
```

## Installation

1. Clone or navigate to this directory
2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

Start the server:
```bash
npm start
```

The server will run on `http://localhost:3000`

## Available Routes

- `/` - Home page
- `/services` - Our Services page
- `/contact` - Contact Us page

## Working Hours

The application is available:
- **Monday to Friday**: 9:00 AM - 5:00 PM
- **Saturday & Sunday**: Closed
- **Outside these hours**: Shows a friendly "closed" message

## Features Detailed

### Custom Middleware (`checkWorkingHours`)
The middleware in `app.js` verifies:
- The current day of the week (must be Monday-Friday)
- The current hour (must be between 9 and 17)
- If outside these times, it renders the `closed.ejs` page

### EJS Template Engine
All pages are rendered using EJS templates, allowing for:
- Dynamic content rendering
- Data passing from server to client
- Template reusability

### Responsive CSS
The `style.css` file includes:
- Gradient navigation bar with active state styling
- Responsive grid layouts for services
- Mobile-friendly breakpoints (768px and 480px)
- Hover effects and transitions for better UX

## Technologies Used

- **Backend**: Node.js, Express.js
- **Template Engine**: EJS
- **Frontend**: HTML, CSS (Responsive Design)
- **Styling**: CSS3 with gradients and flexbox/grid

## Future Enhancements

You could extend this application with:
- Database integration for form submissions
- Email notifications
- Admin panel
- User authentication
- More pages and sections
- API endpoints
