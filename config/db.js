const Pool = require("pg").Pool;
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "note_database",
    host: process.env.DB_HOST,
    port: 5432
});

module.exports = pool;