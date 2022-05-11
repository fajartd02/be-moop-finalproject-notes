const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "fajarganteng",
    database: "note_database",
    host: "localhost",
    port: 5432
});

module.exports = pool;