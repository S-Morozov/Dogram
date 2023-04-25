'use strict';
const { validationResult } = require('express-validator');
const { makeThumbnail } = require('../utils/image');
// postController
const postModel = require('../models/postModel');

//Hakee kaikki postaukset
const getPostList = async (req, res) => {
    try {
        const posts = await postModel.getPostList();
        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};
//Hakee yhen postauksen
const getPost = async (req, res) => {
    try {
        const post = await postModel.getPost(req.params.id);
        res.json(post);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
};
//Hakee postauksen kuvat
const getPostMedia = async (req, res) => {
    try {
        const post = await postModel.getMedia(req.params.id);
        res.json(post);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
};
//Luo postauksen
const create_post = async (req, res) => {
    const { content, dog_id, user_id } = req.body;
    const filenames = req.files ? req.files.map(file => ({
        name: file.filename,
        path: file.path
    })) : [];
    const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    try {
        //Luo postauksen
        const newPost = await postModel.createPost({
            content,
            created_at,
            user_id,
            dog_id
        });

        // Lisää kuvat omaan tauluun
        if (filenames.length > 0) {
            await Promise.all(filenames.map(async (filename) => {
                await makeThumbnail(filename.path, filename.name);
                await postModel.addMedia({
                    media_name: filename.name,
                    post_id: newPost.post_id
                });
            }));
        }

        res.status(201).json(newPost);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};


module.exports = { getPostList, getPost, create_post, getPostMedia };