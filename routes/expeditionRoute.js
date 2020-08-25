const express = require('express');
const router = express.Router();
const Expedtions = require('../models/expeditions.js');
const mongoose = require('mongoose');


router.get('/expeditions/', async (req, res) => {
    try {
        const posts = await Expedtions.find().populate('loot_table.item', 'name description price');
        res.send(posts);

    } catch (error) {
        res.status(400).send({
            status: "error",
            message: error.message,
        })
    }
});
router.get('/expeditions/:id', async (req, res) => {
    try {
        const posts = await Expedtions.findOne({ _id: req.params.id }).populate('loot_table.item', 'name description price');
        if (!posts) throw Error("No match");
        res.send(posts);


    } catch (error) {
        res.status(400).send({
            status: "error",
            message: error.message,
        })
    }
});

router.post('/expeditions/', async (req, res) => {
    try {
        const expedition = await new Expedtions({
            name: req.body.name,
            gold: req.body.gold,
            duration: req.body.duration,
            loot_table: req.body.loot_table,
        })
        const savedPost = await expedition.save();
        res.send({
            status: "success",
            message: `Saved new Player with id ${savedPost._id}`
        });
    } catch (error) {
        console.error(error);
    }
});

router.patch('/expeditions/:id', async (req, res) => {
    try {
        const loot = req.body.loot;
        const expedition = await Expedtions.findOne({ _id: req.params.id })
        const lootTable = expedition.loot_table;

        for (let item of loot) {
            if (item[0] === "5f36cec47e9ca13684464b50") {
                expedition.gold += item[1];
                continue;
            }
            let itemExists = false;
            for (let resource of lootTable) {
                if (resource.item == item[0]) {
                    resource.quantity += item[1];
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
                lootTable.push(newItem);
            }
        }
        expedition.inventory = lootTable;
        const updatedPlayer = await Expedtions.updateOne({ _id: req.params.id }, expedition);
        res.status(201).send({
            status: "success",
            message: `Successfully updatedexpedition ${req.params.id}`,
        });

    } catch (error) {
        console.error(error);
        let message = `Failed to updateexpedition ${req.params.id}`;
        if (error.message == "No match") message = `Failed to findexpedition ${req.params.id}`;
        res.status(400).send({
            status: "Failed",
            message: message,
        });
    }
});

router.delete('/expeditions/:id', async (req, res) => {
    try {
        const deletedPost = await Expedtions.deleteOne({
            _id: req.params.id
        });
        if (deletedPost.deletedCount <= 0) throw new Error("No Post Found");

        res.send({
            status: "Success",
            message: `Deletedexpedition with ID ${deletedPost._id}`,
        });

    } catch (error) {
        console.error(error)
        res.status(400).send({
            status: "Failed",
            message: `Failed to deleteexpedition ${req.params.id}`,
        });
    }
});

module.exports = router