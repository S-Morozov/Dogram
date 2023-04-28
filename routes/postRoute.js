'use strict';
const express = require('express');
const passport = require('passport');
// postRoute
const router = express.Router();
const { body, validationResult } = require('express-validator');
const controller = require('../controllers/postController');
const uploadMiddleware = require('../utils/multer');

//Hakee postauksen kommentit
router.get('/comments/:id', passport.authenticate('jwt', { session: false }), controller.getCommentList);

//Hakee kaikki postaukset
router.get('/', passport.authenticate('jwt', { session: false }), controller.getPostList);

//Hakee postauksen ID:llä
router.get('/:id', passport.authenticate('jwt', { session: false }), controller.getPost);

//Hakee yhden käyttäjän kaikki postaukset
router.get('/user/:id', passport.authenticate('jwt', { session: false }), controller.getUserPosts);

//Hakee postauksen kuvat
router.get('/media/:id', passport.authenticate('jwt', { session: false }), controller.getPostMedia);

//Tekee uuden postauksen
router.post('/:user_id', passport.authenticate('jwt', { session: false }),
  uploadMiddleware.array('file', 5),
  body('content').isLength({ min: 3 }).withMessage('Content must be at least 3 characters').trim().escape(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      // Call the create_post function with the req object
      const newPost = await controller.create_post(req, res);

      res.status(201).json(newPost);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

//Lisää kommentin
router.post('/postComment/:id', passport.authenticate('jwt', { session: false }),
  body('text').isAlpha().isLength({ min: 2 }).withMessage('Content must be at least 2 characters').trim().escape(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    controller.create_comment(req, res);
  }
);

//Delete a post
//router.delete('/:id', controller.post_delete);
module.exports = router;