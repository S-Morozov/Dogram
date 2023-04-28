'use strict';
const pool = require('../database/db');

//Hakee käyttäjän tykkäyksen
const getLike = async (params) => {
    const { user_id, post_id } = params;
    try {
        const query = "SELECT * FROM likes WHERE user_id = ? AND post_id = ?";
        const [result] = await pool.execute(query, [user_id, post_id]);
        return result;
    } catch (error) {
        console.error(error);
        throw new Error('SQL query failed');
    }
};
//Hakee postauksen kaikki liket
const getPostLikes = async (params) => {
    const { user_id, post_id } = params;
    try {
        const query = "SELECT COUNT(*) AS like_count FROM likes WHERE post_id = ?";
        const [result] = await pool.execute(query, [post_id]);
        return result[0].like_count;
    } catch (error) {
        console.error(error);
        throw new Error('SQL query failed');
    }
};
//Luo tykkäyksen
const createLike = async ({ created_at, user_id, post_id }) => {
    console.log(created_at, user_id, post_id);
    try {
        const query = 'INSERT INTO likes (created_at, user_id, post_id) VALUES (?, ?, ?)';
        const [result] = await pool.execute(query, [created_at, user_id, post_id]);
        return { result };
    } catch (error) {
        console.error(error);
        throw new Error('SQL query failed');
    }
};
//Poistaa tykkäyksen
const deleteLike = async ({ user_id, post_id }) => {
    try {
        const query = 'DELETE FROM likes WHERE user_id = ? AND post_id = ?';
        const [result] = await pool.execute(query, [user_id, post_id]);
        return { result };
    } catch (error) {
        console.error(error);
        throw new Error('SQL query failed');
    }
};
module.exports = {
    createLike, getLike, deleteLike, getPostLikes,
};