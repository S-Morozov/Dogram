'use strict';
const { validationResult } = require('express-validator');
const { makeThumbnail } = require('../utils/image');
// userController
const userModel = require('../models/userModel');
const bcryptjs = require('bcryptjs');

//Hakee käyttäjän
const getUser = async (req, res) => {
  try {
    const user = await userModel.getUser(req.params.id);
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};
//Hakee kaikki käyttäjät
const getUserList = async (req, res) => {
  console.log('Creating User', req.body, req.file);
  try {
    const users = await userModel.getAllUsers();
    //console.log(users);
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};
//Luo käyttäjän
const user_create_post = async (req, res) => {
  const { username, email, password, bio } = req.body;
  const { filename } = req.file || {};

  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(password, salt);
  if (req.file) {
    await makeThumbnail(req.file.path, req.file.filename);
  }

  const newUser = {
    username,
    email,
    password: hashedPassword,
    profile_image: filename ?? null,
    bio,
    location: req.body.location ?? null,
    website: req.body.website ?? null,
    created_at: `${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString()}`,
  };

  const errors = validationResult(req);
  if (errors.isEmpty()) {
    try {
      //Mitä jos admin vois laittaa uuden accountin suoraan admin?
      const result = await userModel.addUser(newUser);
      res.status(201).json({ message: 'user created', userId: result });
      
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    console.log('validation errors', errors);
    res.status(400).json({
      message: 'user creation failed',
      errors: errors.array(),
    });
  }
};
//Hakee käyttäjän ID:n
const getUserId = async (req, res) => {
  const { username, email } = req.body;
  try {
    const user_id = await userModel.checkUserId(username, email);
    res.status(200).json({ user_id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get user ID' });
  }
};
const checkToken = (req, res) => {
  res.json({ user: req.user });
};
module.exports = {
  getUserList, getUser, user_create_post, checkToken, getUserId
};