'use strict';
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { login, logout } = require('../controllers/authController');
<<<<<<< HEAD
const { postUser } = require('../controllers/userController');
=======
const { user_create_post } = require('../controllers/userController');
>>>>>>> dc457f306397cea0516dd9b5ba3ef2b304a5c371

router
    .post('/login', login)
    .get('/logout', logout)
    .post(
        '/register',
<<<<<<< HEAD
        body('name').isLength({ min: 3 }).trim().escape(),
=======
>>>>>>> dc457f306397cea0516dd9b5ba3ef2b304a5c371
        body('email').isEmail().normalizeEmail(),
        body('password').isLength({ min: 8 }).trim(),
        user_create_post
    );
module.exports = router;