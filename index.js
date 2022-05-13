const express = require('express');
const router = require ('./routes/index.js');
const dotenv = require('dotenv');
const pool = require("./config/db.js");

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json()); // => req.body();
app.use(express.urlencoded({ extended: true }));

app.use(router);

app.listen(PORT, () => {
    console.log("Server running at http://localhost:" + PORT);
});