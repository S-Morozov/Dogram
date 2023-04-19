'use strict';
const { addListener } = require('../database/db');
const { validationResult } = require('express-validator');
// userController
const userModel = require('../models/userModel');
const bcryptjs = require('bcryptjs');
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
const postUser = async (req, res) => {
  console.log('Creating a new user: ', req.body);
  const salt = await bcryptjs.genSalt(10);
  const password = await bcryptjs.hash(req.body.passwd, salt);
  const newUser = {
    name: req.body.name,
    email: req.body.email,
    passwd: password,
    role: 1,
  };
  const errors = validationResult(req);
  console.log('validation errors', errors);
  if (errors.isEmpty()) {
    try {
      const result = await userModel.addUser(newUser);
      res.status(201).json({ message: 'user created', userId: result });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(400).json({
      message: 'user creation failed',
      errors: errors.array(),
    });
  }
};
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
const checkToken = (req, res) => {
  res.json({ user: req.user });
};
module.exports = {
  getUserList, getUser, postUser, user_create_post, checkToken, postUser
};