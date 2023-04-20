'use strict';
const { addListener } = require('../database/db');
const { validationResult } = require('express-validator');
// userController
const userModel = require('../models/userModel');
const bcryptjs = require('bcryptjs');

const getUser = async (req, res) => {
  try {
    const user = await userModel.getUser(req.params.id);
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};
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
const checkToken = (req, res) => {
  res.json({ user: req.user });
};
module.exports = {
  getUserList, getUser, user_create_post, checkToken
};