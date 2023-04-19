'use strict';
const catModel = require('../models/dogModel');
const { validationResult } = require('express-validator');
const { makeThumbnail, getCoordinates } = require('../utils/image');

const getCatList = async (req, res) => {
    try {
        let cats = await catModel.getAllCats();
        res.json(cats);
    } catch (error) {
        res.status(500).json({ error: 500, message: error.message });
    }
};

const getCat = async (req, res) => {
    //console.log(req.params);
    // convert id value to number
    const catId = Number(req.params.id);
    // check if number is not an integer
    if (!Number.isInteger(catId)) {
        res.status(400).json({ error: 500, message: 'invalid id' });
        return;
    }
    // TODO: wrap to try-catch
    const [cat] = await catModel.getCat(catId);
    // console.log('getCat', cat);
    if (cat) {
        res.json(cat);
    } else {
        // send response 404 if id not found in array
        // res.sendStatus(404);
        res.status(404).json({ message: 'Cat not found.' });
    }
};
//Luo kissan
const cat_create_post = async (req, res) => {
    console.log('posting a cat', req.body, req.file);
    if (!req.file) {
        res.status(400).json({
            status: 400,
            message: 'Invalid or missing image file'
        });
        return;
    }
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        res.status(400).json({
            status: 400,
            errors: validationErrors.array(),
            message: 'Invalid post data'
        });
        return;
    }
    const newCat = req.body;
    const userId = req.user[0].user_id;
    newCat.filename = req.file.filename;
    newCat.owner = userId;
    // make thumbnail
    await makeThumbnail(req.file.path, newCat.filename);
    // get coordinates
    if (req.file.mimetype === ".jpeg") {
        newCat.coords = await getCoordinates(req.file.path);
        console.log('coords', newCat.coords);
    }
    try {
        await catModel.addCat(newCat, userId);
        res.status(201).json({ message: 'new cat added!' });
    } catch (error) {
        res.status(500).json({ error: 500, message: error.message });
    }
};
//Päivitä
const cat_update_put = async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        res.status(400).json({
            status: 400,
            errors: validationErrors.array(),
            message: 'Invalid PUT data'
        });
        return;
    }
    const cat = req.body;
    const user = req.user[0];
    const catId = Number(req.params.id);
    console.log('updating a cat', req.params);
    try {
        const response = await catModel.updateCat(cat, catId, user);
        if (response.affectedRows > 0) {
            res.status(200).json({ message: 'Cat modified!' });
        } else {
            res.status(200).json({ message: "Not your Cat" });
        }
    } catch (error) {
        res.status(500).json({ error: 500, message: error.message });
    }
};
//Poista
const cat_delete = async (req, res) => {
    console.log('deleting a cat', req.params.id);
    try {
        const userId = req.user[0].user_id;
        const userRole = req.user[0].role;
        const response = await catModel.deleteCat(req.params.id, userId, userRole);
        if (response.affectedRows > 0) {
            res.status(200).json({ message: "Cat deleted" });
        } else {
            res.status(200).json({ message: "Not your Cat" });
        }
    } catch (error) {
        res.status(500).json({ error: 500, message: error.message });
    }
};

module.exports = {
    getCatList, getCat, cat_create_post, cat_update_put, cat_delete
};