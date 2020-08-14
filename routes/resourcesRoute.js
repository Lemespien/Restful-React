const express = require('express');
const router = express.Router();
const Resources = require('../models/resources.js');

router.get('/resources/', async (req, res) => {
    try {
        const resources = await Resources.find();
        res.status(200).send(resources);
    } catch (error) {
        res.status(400).send({
            status: "error",
            message: error.message,
        })
    }
});

router.get('/resources/:shortname', async (req, res) => {
    try {
        const resources = await Resources.findOne({
            shortname: req.params.shortname
        });
        res.send(resources);
    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: "error",
            message: error.message,
        })
    }
});

router.post('/resources/', async (req, res) => {
    try {
        const resourceExists = await Resources.findOne(
            { shortname: req.body.shortname }
        );

        if (resourceExists) {
            const updatingResource = await Resources.updateOne({
                shortname: req.body.shortname,
            }, {
                $inc: {
                    quantity: req.body.quantity,
                }
            });
            console.log(updatingResource);
            res.status(200).send({
                status: "Success",
                message: `Successfully updated quantity of ${req.body.shortname} by ${req.body.quantity}`
            });
            return;
        }

        const addedResource = await new Resources({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            quantity: req.body.quantity,
            shortname: req.body.shortname
        });

        const savedResource = await addedResource.save();

        res.status(201).send({
            status: "success",
            message: `Saved a new resource with shortname ${savedResource.shortname}`
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: "error",
            message: error.message,
        })
    }
});

router.delete('/resources/:id', async (req, res) => {
    try {
        const deletedResource = await Resources.deleteOne({
            _id: req.params.id
        });
        if (deletedResource.deletedCount <= 0) throw new Error("No Post Found");

        console.log(deletedResource)
        res.send({
            status: "Success",
            message: `Deleted post with ID ${deletedResource.shortname}`,
        });

    } catch (error) {
        console.error(error)
        res.status(400).send({
            status: "Failed",
            message: `Failed to delete Resource ${req.params.id}`,
        });
    }
});


module.exports = router;