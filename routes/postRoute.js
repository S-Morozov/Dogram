'use strict';
const express = require('express');
const passport = require('passport');
// postRoute
const router = express.Router();
const { body, validationResult } = require('express-validator');
const controller = require('../controllers/postController');
const uploadMiddleware = require('../utils/multer');

//Hakee kaikki postaukset
router.get('/', passport.authenticate('jwt', { session: false }), controller.getPostList);

//Hakee postauksen ID:llä
router.get('/:id', passport.authenticate('jwt', { session: false }), controller.getPost);

//Hakee yhden käyttäjän kaikki postaukset
router.get('/user/:id', passport.authenticate('jwt', { session: false }), controller.getPost);

//Tekee uuden postauksen
router.post('/', passport.authenticate('jwt', { session: false }),
  uploadMiddleware.array('file', 5),
  body('content').isAlpha().isLength({ min: 2 }).withMessage('Content must be at least 2 characters').trim().escape(),
  body('file').custom((value, { req }) => {
    if (!req.files || req.files.length === 0) {
      throw new Error('Files are required');
    }
    for (let file of req.files) {
      if (!['image/png', 'image/jpeg', 'image/gif'].includes(file.mimetype)) {
        throw new Error('Invalid file type');
      }
    }
    return true;
  }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    controller.create_post(req, res);
  }
);
//Hakee postauksen kuvat
router.get('/media/:id', passport.authenticate('jwt', { session: false }), controller.getPostMedia);

//Delete a post
//router.delete('/:id', controller.post_delete);
module.exports = router;