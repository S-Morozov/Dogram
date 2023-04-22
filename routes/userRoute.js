'use strict';
const express = require('express');
const passport = require('passport');

// userRoute
const router = express.Router();
const { body, validationResult } = require('express-validator');
const controller = require('../controllers/userController');
const uploadMiddleware = require('../utils/multer');



//Hakee kaikki käyttäjät
router.get('/', controller.getUserList);
//Tietty käyttäjä
router.get("/token", controller.checkToken);
router.get('/:id', passport.authenticate('jwt', { session: false }), controller.getUser);
// POST
router.post('/',
uploadMiddleware.single('file'),body('username').isLength({min: 3}).isAlpha,
  body('email').isEmail().withMessage('Email must be valid').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    controller.user_create_post(req, res);
  });

// PUT
router.put('/', (req, res) => {
  res.send("With this endpoint you can edit users.");
});

// DELETE
router.delete('/', (req, res) => {
  res.send("With this endpoint you can delete users.");
});
module.exports = router;
