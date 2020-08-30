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
        const loot = req.body.loot_table;
        const expedition = await Expedtions.findOne({ _id: req.params.id })
        const lootTable = expedition.loot_table;

        for (let item of loot) {
            let itemExists = false;
            for (let resource of lootTable) {
                console.log(resource);
                if (resource.item == item.item) {
                    resource.chance = item.chance;
                    itemExists = true;
                    continue;
                }
            }
            if (!itemExists) {
                // add to inventory
                console.log(item);
                const newItem = {
                    _id: mongoose.Types.ObjectId(),
                    item: item.item,
                    chance: item.chance,
                }
                lootTable.push(newItem);
            }
        }
        console.log(lootTable);
        expedition.name = req.body.name ? req.body.name : expedition.name;
        expedition.loot_table = lootTable;
        expedition.duration = req.body.duration ? req.body.duration : expedition.duration;
        expedition.gold = req.body.gold ? req.body.gold : expedition.gold;
        const updatedPlayer = await Expedtions.updateOne({ _id: req.params.id }, expedition);
        res.status(201).send({
            status: "success",
            message: `Successfully updated expedition ${req.params.id}`,
        });

    } catch (error) {
        console.error(error);
        let message = `Failed to update expedition ${req.params.id}`;
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