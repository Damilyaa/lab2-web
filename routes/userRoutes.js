const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth');

const validateRegister = [
  body('username').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Must be a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const validateLogin = [
  body('emailOrUsername').notEmpty().withMessage('Email or username is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

router.post('/register', validateRegister, userController.registerUser);

router.post('/login', validateLogin, userController.loginUser);

router.get('/profile', authMiddleware, userController.getProfile);

module.exports = router;
