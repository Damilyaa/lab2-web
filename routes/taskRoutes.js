const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const taskController = require('../controllers/taskController');
const authMiddleware = require('../middlewares/auth');

const validateTask = [
  body('title').notEmpty().withMessage('Title is required'),
];

router.post('/', authMiddleware, validateTask, taskController.createTask);
router.get('/', authMiddleware, taskController.getTasks);
router.put('/:id', authMiddleware, validateTask, taskController.updateTask);
router.delete('/:id', authMiddleware, taskController.deleteTask);

module.exports = router;
