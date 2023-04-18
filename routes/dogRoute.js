'use strict';
const express = require('express');
const passport = require('passport');
// catRoute
const router = express.Router();
const multer = require('multer');
const { body, validationResult } = require('express-validator');
// piettää kuvalle vanhan nimen
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    const filename = file.originalname || new Date().toISOString();
    callback(null, filename);
  }
});

const upload = multer({ storage });
const controller = require('../controllers/catController');

//Hakee kaikki kissat
router.get('/', passport.authenticate('jwt', { session: false }), controller.getCatList);

//Hakee tietyn kissan
router.get('/:id', passport.authenticate('jwt', { session: false }), controller.getCat);

// Lisää kissan
router.post('/', passport.authenticate('jwt', { session: false }),
  upload.single('cat'),
  body('name').isAlpha().isLength({ min: 3 }).withMessage('Name must be at least 3 characters').trim().escape(),
  body('birthdate').isISO8601().withMessage('Invalid birthdate'),
  body('weight').isNumeric().withMessage('Weight must be a number'),
  body('cat').custom((value, { req }) => {
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
    controller.cat_create_post(req, res);
  }
);

// Muokkaa kissaa
router.put('/:id', body('name').isAlpha().isLength({ min: 3 }).withMessage('Name must be at least 3 characters').trim().escape(),
  body('birthdate').isISO8601().withMessage('Invalid birthdate'),
  body('weight').isNumeric().withMessage('Weight must be a number'),
  (req, res) => {
    console.log("UPDATE", req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    controller.cat_update_put(req, res);
  });
// Poista kissa
router.delete('/:id', controller.cat_delete);
module.exports = router;