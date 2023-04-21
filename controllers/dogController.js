'use strict';
const dogModel = require('../models/dogModel');
const { validationResult } = require('express-validator');
const { makeThumbnail, getCoordinates } = require('../utils/image');

const getdogList = async (req, res) => {
    try {
        let dogs = await dogModel.getAlldogs();
        res.json(dogs);
    } catch (error) {
        res.status(500).json({ error: 500, message: error.message });
    }
};

const getdog = async (req, res) => {
    //console.log(req.params);
    // convert id value to number
    const dogId = Number(req.params.id);
    // check if number is not an integer
    if (!Number.isInteger(dogId)) {
        res.status(400).json({ error: 500, message: 'invalid id' });
        return;
    }
    // TODO: wrap to try-catch
    const [dog] = await dogModel.getdog(dogId);
    // console.log('getdog', dog);
    if (dog) {
        res.json(dog);
    } else {
        // send response 404 if id not found in array
        // res.sendStatus(404);
        res.status(404).json({ message: 'dog not found.' });
    }
};
//Luo kissan
const dog_create_post = async (req, res) => {
    console.log('posting a dog', req.body, req.file);
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
    const newDog = req.body;
    const userId = req.user[0].user_id;
    newDog.filename = req.file.filename;
    newDog.owner = userId;
    // make thumbnail
    await makeThumbnail(req.file.path, newDog.filename);
    // get coordinates
    if (req.file.mimetype === ".jpeg") {
        newDog.coords = await getCoordinates(req.file.path);
        console.log('coords', newDog.coords);
    }
    try {
        await dogModel.addDog(newDog, userId);
        res.status(201).json({ message: 'new dog added!' });
    } catch (error) {
        res.status(500).json({ error: 500, message: error.message });
    }
};
//Päivitä
const dog_update_put = async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        res.status(400).json({
            status: 400,
            errors: validationErrors.array(),
            message: 'Invalid PUT data'
        });
        return;
    }
    const dog = req.body;
    const user = req.user[0];
    const dogId = Number(req.params.id);
    console.log('updating a dog', req.params);
    try {
        const response = await dogModel.updateDog(dog, dogId, user);
        if (response.affectedRows > 0) {
            res.status(200).json({ message: 'dog modified!' });
        } else {
            res.status(200).json({ message: "Not your dog" });
        }
    } catch (error) {
        res.status(500).json({ error: 500, message: error.message });
    }
};
//Poista
const dog_delete = async (req, res) => {
    console.log('deleting a dog', req.params.id);
    try {
        const userId = req.user[0].user_id;
        const userRole = req.user[0].role;
        const response = await dogModel.deleteDog(req.params.id, userId, userRole);
        if (response.affectedRows > 0) {
            res.status(200).json({ message: "dog deleted" });
        } else {
            res.status(200).json({ message: "Not your dog" });
        }
    } catch (error) {
        res.status(500).json({ error: 500, message: error.message });
    }
};

module.exports = {
    getdogList, getdog, dog_create_post, dog_update_put, dog_delete
};