'use strict';
const pool = require('../database/db');
//Hakee kaikki postaukset
const getPostList = async () => {
    try {
        const sql = `SELECT * FROM posts`;
        const [rows] = await pool.query(sql);
        console.log(rows);
        return rows;
    } catch (error) {
        console.error('error', e.message);
        throw new Error('sql query failed');
    }
};
//Hakee yhden postauksen ID:n perusteella
const getPost = async (id) => {
    console.log(id);
    try {
        const [post] = await pool.query('SELECT * FROM posts WHERE post_id = ?', [id]);
        return post;
    } catch (e) {
        console.error("error", e.message);
        return null;
    }
};
const getUserPosts = async (id) => {
    console.log(id);
    try {
        const [post] = await pool.query('SELECT * FROM posts WHERE user_id = ?', [id]);
        return post;
    } catch (e) {
        console.error("error", e.message);
        return null;
    }
};
//Hakee postauksen kuvat
const getMedia = async (post_id) => {
    try {
        const query = 'SELECT * FROM post_media WHERE post_id = ?';
        const [result] = await pool.execute(query, [post_id]);
        return result;
    } catch (error) {
        console.error(error);
        throw new Error('SQL query failed');
    }
};
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
//Luo postauksen
const createPost = async ({ content, created_at, user_id, dog_id }) => {
    console.log(content, created_at, user_id, dog_id);
    try {
        const query = 'INSERT INTO posts (content, created_at, user_id, dog_id) VALUES (?, ?, ?, ?)';
        const [result] = await pool.execute(query, [content, created_at, user_id, dog_id]);
        const post_id = result.insertId;
        return { post_id, content, created_at, user_id, dog_id };
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
//Lisää kuvat
const addMedia = async ({ post_id }) => {
    try {
        const query = 'INSERT INTO post_media (media_name, post_id) VALUES (?, ?)';
        const [result] = await pool.execute(query, [media_name, post_id]);
        return result.affectedRows;
    } catch (error) {
        console.error(error);
        throw new Error('SQL query failed');
    }
};

module.exports = {
    getPostList, getPost, createPost, addMedia, getMedia, getUserPosts, getComments, createComment,
};