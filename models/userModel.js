'use strict';
const pool = require('../database/db');

const getAllUsers = async () => {
  try {
    const [users] = await pool.query(`SELECT user_id, name, email FROM users`);
    return users;
  } catch (e) {
    console.error("error", e.message);
  }
};

const getUser = async (id) => {
  try {
    const [user] = await pool.query('SELECT user_id, username, email, profile_image FROM users WHERE user_id = ?', [id]);
    return user[0];
  } catch (e) {
    console.error("error", e.message);
    return;
  }
};
const addUser = async (user) => {
  console.log("Käyttäjä on : ", user);
  try {
    const [result] = await pool.query('INSERT INTO users (username, email, password, profile_image, bio, location, website, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [
      user.username,
      user.email,
      user.passwd,
      user.role
    ]);
    return result;
  } catch (e) {
    console.error("error", e.message);
    return;
  }
};


const getUserLogin = async (params) => {
  try {
    //console.log('getUserLogin params:', params);
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE username = ?;',
      [params]);
    //console.log('getUserLogin rows:', rows);
    return rows;
  } catch (e) {
    console.log('getUserLogin error:', e.message);
  }
};
//Hakee tietyn käyttäjän ID:n
const checkUserId = async (username, email) => {
  try {
    const [[{ user_id }]] = await pool.execute(
      'SELECT user_id FROM users WHERE username = ? AND email= ?;',
      [username, email]);
    return user_id;
  } catch (error) {
    console.log('checkUserId error:', error.message);
  }
};
module.exports = {
  getUser, getAllUsers, addUser, getUserLogin, checkUserId
};