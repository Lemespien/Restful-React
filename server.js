const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const Posts = require('./models/posts.js');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, 'build')));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/ping', (req, res) => {
    return res.send('pong');
});

app.get('/post/', async (req, res) => {
    const posts = await Posts.find();
    res.send(posts);
});

app.post('/post/', async (req, res) => {
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

app.patch('/post/:id', async (req, res) => {
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

app.delete('/post/:id', async (req, res) => {
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

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log("Connected to DB");
});

app.listen(process.env.PORT || 8080, () => {

    console.log(`App listening on port ${process.env.PORT || 8080} `);
});
