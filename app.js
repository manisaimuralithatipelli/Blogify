require("dotenv").config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const Blog = require('./models/blog');
const Comment=require("./models/comment")
const { checkAuth } = require('./middlewares/auth');
const app = express();
mongoose
    .connect(process.env.MONGODB_URI)
    .then((e) => console.log("MONGO DB CONNECTED"));

const userRoutes = require('./routes/user');
const blogRoutes = require('./routes/blog');
app.use(cookieParser());
app.use(checkAuth("token"));
app.use(express.static(path.resolve("./public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/user', userRoutes);
app.use('/blog', blogRoutes);
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.get('/', async(req, res) => {
    const allBlogs = await Blog.find({}).sort({ createdAt: -1 });
    res.render("home", {
        user: req.user,
        blogs: allBlogs,
    });
});
app.get("/about", (req, res) => {
    return res.render("about", {
        user: req.user,
    });
});
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on http://localhost:3000`);
});
    
