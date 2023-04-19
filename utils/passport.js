"use strict";
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { getUserLogin, getUser } = require("../models/userModel");
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const bcryptjs = require('bcryptjs');
require("dotenv").config();

// local strategy for username password login
passport.use(
    new LocalStrategy(async (email, password, done) => {
        try {
            const [user] = await getUserLogin(email);
            console.log("Local strategy", user); // result is binary row
            if (user === undefined) {
                return done(null, false, { message: "Incorrect email." });
            }
            const login = await bcryptjs.compare(password, user.password);
            if (!login) {
                return done(null, false, { message: "Incorrect password." });
            }
            return done(null, { ...user }, { message: "Logged In Successfully" }); // use spread syntax to create shallow copy to get rid of binary row type
        } catch (err) {
            console.log('passport error', err);
            return done(err);
        }
    })
);

// JWT strategy for handling bearer token
// consider .env for secret, e.g. secretOrKey: process.env.JWT_SECRET

passport.use(
    new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_KEY,
    },
        async (jwtPayload, done) => {
            //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
            console.log('user from token', jwtPayload);
            try {
                const user = await getUser(jwtPayload.user_id);
                return done(null, user);
            } catch (err) {
                return done(err);
            }
            // (or extract data from token)
            // return done(null, jwtPayload);
        }
    ));
module.exports = passport;