'use strict';
const pool = require('../database/db');
const getAllCats = async () => {
  try {
    const sql = `SELECT wop_cat.*, wop_user.name AS ownername FROM wop_cat
                LEFT JOIN wop_user ON wop_cat.owner = wop_user.user_id`;
    const [rows] = await pool.query(sql);
    console.log(rows);
    return rows;
  } catch (e) {
    console.error('error', e.message);
    throw new Error('sql query failed');
  }
};


const getCat = async (id) => {
  console.log(id);
  try {
    const [cat] = await pool.query('SELECT * FROM wop_cat WHERE cat_id = ?', [id]);
    return cat;
  } catch (e) {
    console.error("error", e.message);
    return null;
  }
};


const addCat = async (cat, userId) => {
  console.log("Adding Cat: ", cat);
  try {
    const [result] = await pool.query('INSERT INTO wop_cat (name, weight, owner, filename, birthdate, coords) VALUES (?, ?, ?, ?, ?, ?);', [
      cat.name,
      cat.weight,
      userId,
      cat.filename,
      cat.birthdate,
      cat.coords ?? "[24.74, 60.24]"
    ]);
    return result;
  } catch (e) {
    console.error("error", cat);
    return;
  }
};

const updateCat = async (cat, catId, user) => {
  let sql;
  const values = [
    cat.name,
    cat.weight,
    user.role === 0 ? cat.owner : user.user_id,
    cat.birthdate,
    catId
  ];
  console.log(values);
  if (user.role === 0) {
    sql = `UPDATE wop_cat SET name=?, weight=?, owner=?, birthdate=?
      WHERE cat_id=?`;
  } else {
    sql = `UPDATE wop_cat SET name=?, weight=?, owner=?, birthdate=?
      WHERE cat_id=? AND owner=?`;
    values.push(user.user_id);
  }
  try {
    const [rows] = await pool.execute(sql, values);
    console.log(rows);
    return rows;
  } catch (e) {
    console.error('error', e.message);
    throw new Error('sql update cat failed');
  }
};

const deleteCat = async (id, userId, userRole) => {
  let sql;
  if (userRole === 0) {
    sql = `DELETE FROM wop_cat WHERE cat_id=?`;
  } else {
    sql = `DELETE FROM wop_cat WHERE cat_id=? AND owner=?`;
  }
  try {
    const [rows] = await pool.query(sql, [id, userId]);
    console.log(rows);
    return rows;
  } catch (e) {
    console.error('error', e.message);
    throw new Error('sql delete cat failed');
  }
};



module.exports = {
  getCat, getAllCats, addCat, updateCat, deleteCat
};