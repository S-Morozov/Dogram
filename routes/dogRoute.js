'use strict';
const express = require('express');
const passport = require('passport');
// dogRoute
const router = express.Router();
const controller = require('../controllers/dogController');
const { body, validationResult } = require('express-validator');
const uploadMiddleware = require('../utils/multer');

//Hakee kaikki koirat
router.get('/', passport.authenticate('jwt', { session: false }), controller.getdogList);

//Hakee tietyn koiran
router.get('/:id', passport.authenticate('jwt', { session: false }), controller.getdog);

//Hakee tietyn käyttäjän koirat
router.get('/user/:id', passport.authenticate('jwt', { session: false }), controller.getdogs);

// Lisää koiran
router.post('/', passport.authenticate('jwt', { session: false }),
  uploadMiddleware.single('file'),
  body('name').isAlpha().isLength({ min: 3 }).withMessage('Name must be at least 3 characters').trim().escape(),
  body('age').isNumeric().withMessage('Age must be a number'),
  body('file').custom((value, { req }) => {
    if (!req.file) {
      throw new Error('File is required');
    } else if (!['image/png', 'image/jpeg', 'image/gif'].includes(req.file.mimetype)) {
      throw new Error('Invalid file type');
    } else {
      return true;
    }
  }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    controller.dog_create_post(req, res);
  }
);

// Muokkaa koiraa
router.put('/:id', body('name').isAlpha().isLength({ min: 3 }).withMessage('Name must be at least 3 characters').trim().escape(),
  body('birthdate').isISO8601().withMessage('Invalid birthdate'),
  body('weight').isNumeric().withMessage('Weight must be a number'),
  (req, res) => {
    console.log("UPDATE", req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    controller.dog_update_put(req, res);
  });
// Poista koira
router.delete('/:id', controller.dog_delete);
module.exports = router;