'use strict';
const { validationResult } = require('express-validator');
const { makeThumbnail } = require('../utils/image');
// userController
const userModel = require('../models/userModel');
const bcryptjs = require('bcryptjs');
<<<<<<< HEAD
=======

const getUser = async (req, res) => {
  try {
    const user = await userModel.getUser(req.params.id);
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};
>>>>>>> dc457f306397cea0516dd9b5ba3ef2b304a5c371
const getUserList = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    //console.log(users);
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};
//Pitää muokkaa
<<<<<<< HEAD
const postUser = async (req, res) => {
  console.log('Creating a new user: ', req.body);
  const salt = await bcryptjs.genSalt(10);
  const password = await bcryptjs.hash(req.body.passwd, salt);
  const newUser = {
    name: req.body.name,
    email: req.body.email,
    passwd: password,
    role: 1,
=======
const user_create_post = async (req, res) => {
  console.log('Creating a new user: ', req.body);
  const salt = await bcryptjs.genSalt(10);
  const password = await bcryptjs.hash(req.body.password, salt);
  const newUser = {
    username: req.body.username,
    email: req.body.email,
    password: password,
    profile_image: null,
    bio: null,
    location: req.body.location,
    website: null,
    created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
>>>>>>> dc457f306397cea0516dd9b5ba3ef2b304a5c371
  };
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    try {
      //Mitä jos admin vois laittaa uuden accountin suoraan admin?
      const result = await userModel.addUser(newUser);
      res.status(201).json({ message: 'user created', userId: result });
<<<<<<< HEAD
=======

>>>>>>> dc457f306397cea0516dd9b5ba3ef2b304a5c371
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
<<<<<<< HEAD
const getUser = async (req, res) => {
  try {
    const user = await userModel.getUser(req.params.id);
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};
const user_create_post = async (req, res) => {
  try {
    userModel.addUser(req.body);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};
=======
>>>>>>> dc457f306397cea0516dd9b5ba3ef2b304a5c371
const checkToken = (req, res) => {
  res.json({ user: req.user });
};
module.exports = {
<<<<<<< HEAD
  getUserList, getUser, postUser, user_create_post, checkToken
=======
  getUserList, getUser, user_create_post, checkToken
>>>>>>> dc457f306397cea0516dd9b5ba3ef2b304a5c371
};