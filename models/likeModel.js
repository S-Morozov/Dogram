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
module.exports = {
    createLike, getLike,
};