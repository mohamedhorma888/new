const express = require('express');
const taskController = require('../controllers/taskController');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

// All task routes require authentication
router.use(verifyToken);

// Task CRUD operations
router.post('/', taskController.createTask);
router.get('/', taskController.getUserTasks);
router.get('/:id', taskController.getTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
