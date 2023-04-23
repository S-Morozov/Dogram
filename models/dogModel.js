'use strict';
const pool = require('../database/db');
const getAllDogs = async () => {
  try {
    const sql = `SELECT dogs.*, users.name AS ownername FROM dogs
                LEFT JOIN users ON dogs.owner = users.user_id`;
    const [rows] = await pool.query(sql);
    console.log(rows);
    return rows;
  } catch (e) {
    console.error('error', e.message);
    throw new Error('sql query failed');
  }
};


const getDog = async (id) => {
  try {
    const [dog] = await pool.query('SELECT * FROM dogs WHERE dog_id = ?', [id]);
    return dog;
  } catch (e) {
    console.error("error", e.message);
    return null;
  }
};

const getUserDogs = async (id) => {
  try {

    const [dog] = await pool.query('SELECT * FROM dogs WHERE owner_id = ?', [id]);
    return dog;
  } catch (e) {
    console.error("error", e.message);
    return null;
  }
};
const addDog = async (dog) => {
  console.log("Adding dog: ", dog);
  try {
    const [result] = await pool.query('INSERT INTO dogs (name, breed, age, gender, color, bio, profile_image, owner_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);', [
      dog.name,
      dog.breed,
      dog.age,
      dog.gender,
      dog.color,
      dog.bio,
      dog.filename,
      dog.owner,
      new Date().toISOString().slice(0, 19).replace('T', ' '),
    ]);
    return result;
  } catch (e) {
    console.error("error", e);
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
  getDog, getAllDogs, addDog, updateDog, deleteDog, getUserDogs
};