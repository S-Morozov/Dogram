'use strict';
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const authRoute = require('./routes/authRoute');
const dogRouter = require('./routes/dogRoute.js');
const userRouter = require('./routes/userRoute.js');
const postRouter = require('./routes/postRoute.js');
const likeRouter = require('./routes/likeRouter.js');
const commentRouter = require('./routes/commentRouter.js');

require('./utils/passport');

const app = express();
const port = 3000;

// Log middleware
app.use((req, res, next) => {
    console.log(Date.now() + ': request: ' + req.method + ' ' + req.path);
    next();
});

// Serve example-ui
app.use(express.static('example-ui'));
// Serve uploaded image files
app.use('/uploads', express.static('uploads'));
// Add 'Access-Control-Allow-Origin: *' header to all
// responses using cors middleware
app.use(cors());
// middleware for parsing request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", express.static("example-ui"));
app.use("/uploads/", express.static("uploads"));
app.use('/thumbnails', express.static('thumbnails'));
app.use(passport.initialize());
app.use('/auth', authRoute);
app.use('/dog', passport.authenticate('jwt', { session: false }), dogRouter);
app.use('/user', passport.authenticate('jwt', { session: false }), userRouter);
app.use('/post', passport.authenticate('jwt', { session: false }), postRouter);
app.use('/like', passport.authenticate('jwt', { session: false }), likeRouter);
app.use('/comment', passport.authenticate('jwt', { session: false }), commentRouter);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));