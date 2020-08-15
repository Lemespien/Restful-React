const express = require('express');
const router = express.Router();
const Players = require('../models/players.js');
const mongoose = require('mongoose');


router.get('/players/', async (req, res) => {
    try {
        const posts = await Players.find().populate('inventory.item', 'name description price');
        res.send(posts);

    } catch (error) {
        res.status(400).send({
            status: "error",
            message: error.message,
        })
    }
});

router.post('/players/', async (req, res) => {
    console.log(req.body);
    try {
        const post = await new Players({
            name: req.body.name,
            gold: req.body.gold,
            inventory: req.body.inventory,
        })
        const savedPost = await post.save();
        res.send({
            status: "success",
            message: `Saved new Player with id ${savedPost._id}`
        })
        console.log(savedPost);
    } catch (error) {
        console.error(error);
    }
});

router.patch('/players/:id', async (req, res) => {
    try {
        const loot = req.body.loot;
        console.log(loot);
        const post = await Players.findOne({ _id: req.params.id })
        console.log(post);
        const playerInventory = post.inventory;
        console.log(playerInventory);

        for (let item of loot) {
            if (item[0] === "5f36cec47e9ca13684464b50") {
                post.gold += item[1];
                continue;
            }
            let itemExists = false;
            for (let resource of playerInventory) {
                console.log("I'm fetching a player item");
                if (resource.item == item[0]) {
                    console.log(`Pre-UPDATEitem: ${resource.item} quantity: ${resource.quantity}`);
                    resource.quantity += item[1];
                    console.log(`AFTER-UPDATE: item: ${resource.item} quantity: ${resource.quantity}`);
                    itemExists = true;
                    continue;
                }
            }
            if (!itemExists) {
                // add to inventory
                const newItem = {
                    _id: mongoose.Types.ObjectId(),
                    item: item[0],
                    quantity: item[1],
                }
                playerInventory.push(newItem);
            }
            console.log("I'm about to fetch a new loot item");
        }
        post.inventory = playerInventory;
        const updatedPlayer = await Players.updateOne({ _id: req.params.id }, post);
        console.log(updatedPlayer);
        // if (post.nModified <= 0) throw new Error("No match");
        // console.log(post);
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

router.delete('/players/:id', async (req, res) => {
    try {
        const deletedPost = await Players.deleteOne({
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