'use strict';
const { validationResult } = require('express-validator');
const { makeThumbnail } = require('../utils/image');
// postController
const postModel = require('../models/commentModel');

//Hakee postauksen kommentit
const getCommentList = async (req, res) => {
    try {
        const post = await postModel.getComments(req.params.id);
        res.json(post);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
};
//Luo uuden kommentin
const create_comment = async (req, res) => {
    const { text, user_id } = req.body;
    const { id } = req.params;
    const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    try {
        const newComment = await postModel.createComment({
            text,
            created_at,
            user_id,
            post_id: id
        });
        res.status(201).json(newComment);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};
module.exports = { create_comment, getCommentList };