const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');

const verifyToken = (req, res, next) => {
  try {
    // Get token from cookie or Authorization header
    let token = req.cookies.token;

    if (!token && req.headers.authorization) {
      token = req.headers.authorization.replace('Bearer ', '');
    }

    if (!token) {
      return next(new AppError('No token provided. Please log in.', 401));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Token expired. Please log in again.', 401));
    }
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid token. Please log in.', 401));
    }
    return next(new AppError('Authentication failed', 401));
  }
};

module.exports = verifyToken;
