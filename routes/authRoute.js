'use strict';
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { login, logout } = require('../controllers/authController');
const { user_create_post } = require('../controllers/userController');

router
    .post('/login', login)
    .get('/logout', logout)
    .post(
        '/register',
        body('email').isEmail().normalizeEmail(),
        body('password').isLength({ min: 8 }).trim(),
        user_create_post
    );

module.exports = router;