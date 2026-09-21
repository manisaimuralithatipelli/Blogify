const { Router } = require('express');
const multer = require('multer');
const path = require('path');
const router = Router();
const Blog = require("../models/blog");
const Comment=require("../models/comment");
const mongoose = require("mongoose");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(`./public/uploads/`));
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    },
});

const upload = multer({ storage: storage })

router.get("/add-new", (req, res) => {
    return res.render("addBlogs", {
        user: req.user,
    });
});

router.get("/:id", async (req, res) => {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).send("Blog not found");
    }

    const blog = await Blog.findById(req.params.id).populate("createdBy");
     if (!blog) {
        return res.status(404).send("Blog not found");
    }

    const comments = await Comment.find({blogId: req.params.id}).populate("createdBy");
    //console.log("comments",comments);
    return res.render("blog", {
        user: req.user,
        blog: blog,
        comments: comments,
    });
});

router.post("/comment/:blogId", async (req, res) => {
    const comment = await Comment.create({
        content: req.body.content,
        blogId: req.params.blogId,
        createdBy: req.user.id,
    });
    return res.redirect(`/blog/${req.params.blogId}`);
});
router.post("/", upload.single('coverImage'), async (req, res) => {
    const { title, content } = req.body;
    if (!req.file) {
    return res.status(400).render("addBlogs", {
        error: "Please select a cover image",
    });
}
    const blog = await Blog.create({
        title: title,
        content: content,
        createdBy: req.user.id,
        coverImageUrl: `/uploads/${req.file.filename}`,
    });

    return res.redirect(`/blog/${blog._id}`);
});
module.exports = router;