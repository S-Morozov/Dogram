'use strict';
const express = require('express');
const passport = require('passport');
// dogRoute
const router = express.Router();
const controller = require('../controllers/commentController');
const { body, validationResult } = require('express-validator');
const uploadMiddleware = require('../utils/multer');

//Hakee postauksen kommentit
router.get('/:id', passport.authenticate('jwt', { session: false }), controller.getCommentList);

//Lisää kommentin
router.post('/:id', passport.authenticate('jwt', { session: false }),
    body('text').isAlpha().isLength({ min: 2 }).withMessage('Content must be at least 2 characters').trim().escape(),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        controller.create_comment(req, res);
    }
);

module.exports = router;