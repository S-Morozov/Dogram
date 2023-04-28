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
//Hakee yhden käyttäjän kaikki postaukset
const getUserPosts = async (req, res) => {
    try {
        const post = await postModel.getUserPosts(req.params.id);
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
//Hakee postauksen kommentit
const getCommentList = async (req, res) => {
    try {
        const post = await postModel.getComments(req.params.id);
        res.json(post);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
};
//Hakee käyttäjän tykkäyksen
const getUserLike = async (req, res) => {
    try {
        const like = await postModel.getLike(req.params);
        res.json(like);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
};
//Luo postauksen
const create_post = async (req, res) => {
    const { content, dog_id } = req.body;
    const user_id = req.params.user_id;
    const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');

    try {
        //Luo postauksen
        const newPost = await postModel.createPost({
            content,
            created_at,
            user_id,
            dog_id,
        });

        // Lisää kuvat omaan tauluun
        if (req.files && req.files.length > 0) {
            await Promise.all(
                req.files.map(async (file) => {
                    console.log(file);
                    await makeThumbnail(file.path, file.originalname);
                    await postModel.addMedia({
                        media_name: file.originalname,
                        post_id: newPost.post_id,
                    });
                })
            );
        }

        res.status(201).json(newPost);
    } catch (error) {
        console.error(error);
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
//Luo tykkäyksen
const create_like = async (req, res) => {
    console.log(req.params);
    const { id,user_id } = req.params;
    const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    try {
        const newLike = await postModel.createLike({
            created_at,
            user_id,
            post_id: id
        });
        res.status(201).json(newLike);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = { getPostList, getPost, create_post, getPostMedia, getUserPosts, create_comment, getCommentList, create_like, getUserLike };