'use strict';
const pool = require('../database/db');
const getAllDogs = async () => {
  try {
    const sql = `SELECT dogs.*, wop_user.name AS ownername FROM dogs
                LEFT JOIN wop_user ON dogs.owner = wop_user.user_id`;
    const [rows] = await pool.query(sql);
    console.log(rows);
    return rows;
  } catch (e) {
    console.error('error', e.message);
    throw new Error('sql query failed');
  }
};


const getDog = async (id) => {
  console.log(id);
  try {
    const [dog] = await pool.query('SELECT * FROM dogs WHERE cat_id = ?', [id]);
    return dog;
  } catch (e) {
    console.error("error", e.message);
    return null;
  }
};


const addDog = async (dog, userId) => {
  console.log("Adding dog: ", dog);
  try {
    const [result] = await pool.query('INSERT INTO dogs (name, weight, owner, filename, birthdate, coords) VALUES (?, ?, ?, ?, ?, ?);', [
      dog.name,
      dog.weight,
      userId,
      dog.filename,
      dog.birthdate,
      dog.coords ?? "[24.74, 60.24]"
    ]);
    return result;
  } catch (e) {
    console.error("error", dog);
    return;
  }
};

const updateDog = async (dog, dogId, user) => {
  let sql;
  const values = [
    dog.name,
    dog.weight,
    user.role === 0 ? dog.owner : user.user_id,
    dog.birthdate,
    dogId
  ];
  console.log(values);
  if (user.role === 0) {
    sql = `UPDATE dogs SET name=?, weight=?, owner=?, birthdate=?
      WHERE dog_id=?`;
  } else {
    sql = `UPDATE dogs SET name=?, weight=?, owner=?, birthdate=?
      WHERE dog_id=? AND owner=?`;
    values.push(user.user_id);
  }
  try {
    const [rows] = await pool.execute(sql, values);
    console.log(rows);
    return rows;
  } catch (e) {
    console.error('error', e.message);
    throw new Error('sql update dog failed');
  }
};

const deleteDog = async (id, userId, userRole) => {
  let sql;
  if (userRole === 0) {
    sql = `DELETE FROM dogs WHERE dog_id=?`;
  } else {
    sql = `DELETE FROM dogs WHERE dog_id=? AND owner=?`;
  }
  try {
    const [rows] = await pool.query(sql, [id, userId]);
    console.log(rows);
    return rows;
  } catch (e) {
    console.error('error', e.message);
    throw new Error('sql delete dog failed');
  }
};



module.exports = {
  getDog, getAllDogs, addDog, updateDog, deleteDog
};