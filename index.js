const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const pool = require("./config/db.js"); 
const router = require ('./routes/index.js');

const PORT = 3000;

app.use(express.json()); // => req.body();
app.use(router);

app.listen(PORT, () => {
    console.log("Server running at http://localhost:" + PORT);
}); 