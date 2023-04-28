'use strict';
const pool = require('../database/db');

const getComments = async (post_id) => {
    try {
        const query = 'SELECT comments.*, users.username, users.profile_image FROM comments INNER JOIN users ON comments.user_id = users.user_id WHERE comments.post_id = ?';
        const [result] = await pool.execute(query, [post_id]);
        return result;
    } catch (error) {
        console.error(error);
        throw new Error('SQL query failed');
    }
};
//Luo kommentin
const createComment = async ({ text, created_at, user_id, post_id }) => {
    console.log(text, created_at, user_id, post_id);
    try {
        const query = 'INSERT INTO comments (content, created_at, user_id, post_id) VALUES (?, ?, ?, ?)';
        const [result] = await pool.execute(query, [text, created_at, user_id, post_id]);
        return { text };
    } catch (error) {
        console.error(error);
        throw new Error('SQL query failed');
    }
};
module.exports = {
    getComments, createComment,
};