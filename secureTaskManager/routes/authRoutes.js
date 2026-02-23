const express = require('express');
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Rate limiting for login/signup routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});

// Public routes
router.post('/signup', authLimiter, authController.signup);
router.post('/login', authLimiter, authController.login);

// Private routes
router.post('/logout', verifyToken, authController.logout);
router.get('/me', verifyToken, authController.getMe);

// Google OAuth routes (will be configured in main app)
router.get('/google/callback', authController.googleCallback);

module.exports = router;
