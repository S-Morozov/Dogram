'use strict';
const express = require('express');
const passport = require('passport');
// likeRoute
const router = express.Router();
const { body, validationResult } = require('express-validator');
const controller = require('../controllers/likeController');

//Hakee tietyn käyttäjän tykkäyksen, jos on
router.get('/:user_id,:post_id', passport.authenticate('jwt', { session: false }), controller.getUserLike);
//Lisää tykkäyksen
router.post('/:post_id,:user_id', passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        controller.create_like(req, res);
    }
);
//Poistaa tykkäyksen
router.post('/:post_id,:user_id', passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        controller.create_like(req, res);
    });

module.exports = router;