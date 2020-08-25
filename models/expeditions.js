const mongoose = require('mongoose');
const Resources = require('./resources.js');
const Expeditions = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    gold: {
        type: Number,
        required: true,
    },
    loot_table: [{
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: Resources
        },
        chance: {
            type: Number,
            required: true
        }

    }
    ],
    duration: {
        type: Number,
        required: true,
    },
    date_created: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model("Expeditions", Expeditions);
