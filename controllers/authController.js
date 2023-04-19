'use strict';
const jwt = require('jsonwebtoken');
const passport = require('passport');
require('dotenv').config();

const login = (req, res, next) => {
    passport.authenticate("local", { session: false }, (err, user, info) => {
        if (err || !user) {
            console.log('auth error', info);
            return res.status(401).json({
                message: 'Username / password wrong',
                // or more detailed message:
                //message: info.message,
            });
        }
        req.login(user, { session: false }, (err) => {
            if (err) {
                res.json({ message: err });
            }
            // generate a signed son web token with the contents of user object and return it in the response
            const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_KEY);
            return res.json({ user, token });
        });
    })(req, res, next);
};
const logout = (req, res) => {
    // Client logs out itself by removing the token from local/session storage
    res.json({ message: 'Logged out!' });
};

module.exports = {
    login,
    logout,
};