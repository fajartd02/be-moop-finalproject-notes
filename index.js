const express = require('express');
const router = require ('./routes/index.js');
const dotenv = require('dotenv');
const pool = require("./config/db.js");
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();
const config = require('./config/config');
const PORT = config.port

app.use(express.json()); // => req.body();
app.use(cookieParser());

app.use(router);

app.listen(PORT, async () => {
    try {
        await pool.query(
            `CREATE TABLE IF NOT EXISTS users (
                id SERIAL NOT NULL PRIMARY KEY,
                username VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL,
                full_name VARCHAR(255) NOT NULL,
                access_token VARCHAR(255)
            );`
        );

        await pool.query(
            `CREATE TABLE IF NOT EXISTS notes (
                id SERIAL NOT NULL PRIMARY KEY,
                user_id INT NOT NULL,
                title VARCHAR(255) NOT NULL,
                content VARCHAR(255) NOT NULL,
                created_at TIMESTAMP NOT NULL,
                updated_at TIMESTAMP NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id)
            );`
        );
    } catch (error) {
        console.log(error.message);
        return;
    }
    console.log("Server running at http://localhost:" + PORT);
});