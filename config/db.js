const Pool = require("pg").Pool;
const dotenv = require('dotenv');
const config = require('../config/config');

dotenv.config();

const pool = new Pool({
    user: config.db.username,
    password: config.db.password,
    database: config.db.database,
    host: config.db.host,
    port: config.db.port
});

module.exports = pool;