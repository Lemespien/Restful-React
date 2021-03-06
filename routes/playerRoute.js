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
router.get('/players/:id', async (req, res) => {
    try {
        const posts = await Players.findOne({ _id: req.params.id }).populate('inventory.item', 'name description price');
        if (!posts) throw Error("No match");
        res.send(posts);


    } catch (error) {
        res.status(400).send({
            status: "error",
            message: error.message,
        })
    }
});

router.post('/players/', async (req, res) => {
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
        });
    } catch (error) {
        console.error(error);
    }
});

router.patch('/players/:id', async (req, res) => {
    try {
        const loot = req.body.loot;
        const post = await Players.findOne({ _id: req.params.id })
        const playerInventory = post.inventory;
        console.log(loot);

        for (let item of loot) {
            console.log(item);
            const [resource, quantity] = item;
            console.log(resource, quantity);
            if (resource._id === "5f36cec47e9ca13684464b50") {
                post.gold += quantity;
                continue;
            }
            let itemExists = false;
            for (let invItem of playerInventory) {
                if (invItem.item._id == resource._id) {
                    invItem.quantity += quantity;
                    itemExists = true;
                    continue;
                }
            }
            if (!itemExists) {
                // add to inventory
                const newItem = {
                    _id: mongoose.Types.ObjectId(),
                    item: resource,
                    quantity: quantity,
                }
                playerInventory.push(newItem);
            }
        }
        post.inventory = playerInventory;
        const updatedPlayer = await Players.updateOne({ _id: req.params.id }, post);
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