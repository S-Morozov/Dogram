'use strict';
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { login, logout } = require('../controllers/authController');
const { user_create_post } = require('../controllers/userController');
const { dog_create_post } = require('../controllers/dogController');
const uploadMiddleware = require('../utils/multer');


router
    .post('/login', login)
    .get('/logout', logout)
    .post(
        '/registerDog',
        dog_create_post
    )
    .post('/register',uploadMiddleware.single('file'),
        body('username').isLength({min:3}),
        body('email').isEmail().normalizeEmail(),
        body('password').isLength({ min: 8 }).trim(),
        user_create_post
    );
module.exports = router;