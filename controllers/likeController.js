const postModel = require('../models/likeModel.js');

//Hakee käyttäjän tykkäyksen
const getUserLike = async (req, res) => {
    try {
        const like = await postModel.getLike(req.params);
        res.json(like);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
};
//Hakee postauksen tykkäysten määrän
const getPostLikes = async (req, res) => {
    console.log(req.params);
    const { post_id } = req.params;
    try {
        const newLike = await postModel.getPostLikes({
            post_id
        });
        res.status(201).json(newLike);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};
//Luo tykkäyksen
const create_like = async (req, res) => {
    console.log(req.params);
    const { post_id, user_id } = req.params;
    const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    try {
        const newLike = await postModel.createLike({
            created_at,
            user_id,
            post_id
        });
        res.status(201).json(newLike);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};
//Poistaa tykkäyksen
const delete_like = async (req, res) => {
    console.log(req.params);
    const { post_id, user_id } = req.params;
    const created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    try {
        const newLike = await postModel.deleteLike({
            created_at,
            user_id,
            post_id
        });
        res.status(201).json(newLike);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};
module.exports = { create_like, getUserLike, delete_like, getPostLikes };