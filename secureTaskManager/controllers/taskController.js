const Task = require('../models/Task');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// @desc    Create a new task
// @route   POST /tasks
// @access  Private
exports.createTask = catchAsync(async (req, res, next) => {
  const { title, description, priority, dueDate } = req.body;

  // Validation
  if (!title) {
    return next(new AppError('Please provide a task title', 400));
  }

  if (!req.user || !req.user.id) {
    return next(new AppError('User not authenticated', 401));
  }

  const task = await Task.create({
    title,
    description,
    priority: priority || 'medium',
    dueDate,
    owner: req.user.id,
    status: 'pending'
  });

  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    task
  });
});

// @desc    Get all tasks for authenticated user
// @route   GET /tasks
// @access  Private
exports.getUserTasks = catchAsync(async (req, res, next) => {
  if (!req.user || !req.user.id) {
    return next(new AppError('User not authenticated', 401));
  }

  const { status, priority, sortBy } = req.query;

  // Build filter
  const filter = { owner: req.user.id };
  if (status) {
    filter.status = status;
  }
  if (priority) {
    filter.priority = priority;
  }

  // Build sort
  let sort = '-createdAt'; // Default: newest first
  if (sortBy === 'dueDate') {
    sort = 'dueDate';
  } else if (sortBy === 'priority') {
    sort = 'priority';
  }

  const tasks = await Task.find(filter).sort(sort);

  res.status(200).json({
    success: true,
    count: tasks.length,
    tasks
  });
});

// @desc    Get a single task by ID
// @route   GET /tasks/:id
// @access  Private
exports.getTask = catchAsync(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return next(new AppError('Task not found', 404));
  }

  // Check ownership
  if (task.owner.toString() !== req.user.id) {
    return next(new AppError('Not authorized to access this task', 403));
  }

  res.status(200).json({
    success: true,
    task
  });
});

// @desc    Update a task
// @route   PUT /tasks/:id
// @access  Private
exports.updateTask = catchAsync(async (req, res, next) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    return next(new AppError('Task not found', 404));
  }

  // Check ownership
  if (task.owner.toString() !== req.user.id) {
    return next(new AppError('Not authorized to update this task', 403));
  }

  // Allowed fields to update
  const allowedUpdates = ['title', 'description', 'status', 'priority', 'dueDate'];
  const updates = {};

  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  updates.updatedAt = Date.now();

  task = await Task.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    message: 'Task updated successfully',
    task
  });
});

// @desc    Delete a task
// @route   DELETE /tasks/:id
// @access  Private
exports.deleteTask = catchAsync(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return next(new AppError('Task not found', 404));
  }

  // Check ownership
  if (task.owner.toString() !== req.user.id) {
    return next(new AppError('Not authorized to delete this task', 403));
  }

  await Task.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Task deleted successfully'
  });
});
