const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Set JWT in HTTP-only secure cookie
const sendTokenResponse = (user, statusCode, req, res) => {
  const token = generateToken(user._id);

  // Cookie options
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: process.env.COOKIE_HTTP_ONLY === 'true',
    secure: process.env.COOKIE_SECURE === 'true', // Only in production with HTTPS
    sameSite: process.env.COOKIE_SAME_SITE || 'strict'
  };

  // Remove password before sending response
  user.password = undefined;

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      success: true,
      token,
      user
    });
};

// @desc    Register a new user
// @route   POST /auth/signup
// @access  Public
exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;

  // Validation
  if (!name || !email || !password || !passwordConfirm) {
    return next(new AppError('Please provide all required fields', 400));
  }

  if (password !== passwordConfirm) {
    return next(new AppError('Passwords do not match', 400));
  }

  if (password.length < 6) {
    return next(new AppError('Password must be at least 6 characters', 400));
  }

  // Check if user already exists
  let user = await User.findOne({ email });
  if (user) {
    return next(new AppError('User already exists with that email', 400));
  }

  // Create user
  user = await User.create({
    name,
    email,
    password,
    authProvider: 'local'
  });

  sendTokenResponse(user, 201, req, res);
});

// @desc    Login user with email and password
// @route   POST /auth/login
// @access  Public
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // Check for user (with password selected)
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new AppError('Invalid email or password', 401));
  }

  // Check if password matches
  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    return next(new AppError('Invalid email or password', 401));
  }

  sendTokenResponse(user, 200, req, res);
});

// @desc    Logout user - clear cookie
// @route   POST /auth/logout
// @access  Private
exports.logout = catchAsync(async (req, res, next) => {
  res.clearCookie('token');
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

// @desc    Get current logged in user
// @route   GET /auth/me
// @access  Private
exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    success: true,
    user
  });
});

// @desc    Google OAuth callback - Create or find user
// @route   Used by Passport.js
// @access  Public
exports.googleCallback = catchAsync(async (req, res, next) => {
  // User is already authenticated by Passport
  // This would typically be called after successful Google authentication
  res.status(200).json({
    success: true,
    message: 'Google authentication successful',
    user: req.user
  });
});
