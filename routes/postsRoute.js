const express = require('express');
const router = express.Router();
const Posts = require('../models/posts.js');


router.get('/post/', async (req, res) => {
    try {
        const posts = await Posts.find();
        res.send(posts);

    } catch (error) {
        res.status(400).send({
            status: "error",
            message: error.message,
        })
    }
});

router.post('/post/', async (req, res) => {
    console.log(req.body);
    try {
        const post = await new Posts({
            title: req.body.title,
            description: req.body.description,
            content: req.body.content,
        })
        const savedPost = await post.save();
        res.send({
            status: "success",
            message: `Saved new post with id ${savedPost._id}`
        })
        console.log(savedPost);
    } catch (error) {
        console.error(error);
    }
});

router.patch('/post/:id', async (req, res) => {
    try {
        console.log(req.params.id);
        const post = await Posts.updateOne({ _id: req.params.id },
            {
                title: req.body.title,
                description: req.body.description
            });
        if (post.nModified <= 0) throw new Error("No match");
        console.log(post);
        res.status(201).send({
            status: "success",
            message: `Successfully updated post ${req.params.id}`,
        });

    } catch (error) {
        console.error(error);
        let message = `Failed to update post ${req.params.id}`;
        if (error.message == "No match") message = `Failed to find post ${req.params.id}`;
        res.status(400).send({
            status: "Failed",
            message: message,
        });
    }
});

router.delete('/post/:id', async (req, res) => {
    try {
        const deletedPost = await Posts.deleteOne({
            _id: req.params.id
        });
        if (deletedPost.deletedCount <= 0) throw new Error("No Post Found");

        console.log(deletedPost)
        res.send({
            status: "Success",
            message: `Deleted post with ID ${deletedPost._id}`,
        });

    } catch (error) {
        console.error(error)
        res.status(400).send({
            status: "Failed",
            message: `Failed to delete post ${req.params.id}`,
        });
    }
});

module.exports = router