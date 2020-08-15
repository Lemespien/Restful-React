const mongoose = require('mongoose');
const Resources = require('./resources.js');
const Players = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    gold: {
        type: Number,
        required: true,
    },
    inventory: [{
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: Resources
        },
        quantity: {
            type: Number,
            required: true
        }

    }
    ],
    date_created: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model("Players", Players);
