const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const postRoutes = require('./routes/postsRoute.js');
const resourceRoutes = require('./routes/resourcesRoute.js');
const playerRoutes = require('./routes/playerRoute.js');
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

app.use(postRoutes);
app.use(resourceRoutes);
app.use(playerRoutes);

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log("Connected to DB");
});

app.listen(process.env.PORT || 8080, () => {

    console.log(`App listening on port ${process.env.PORT || 8080} `);
});
