const dotenv = require('dotenv');

dotenv.config();
const { env } = process;

const config = {
    hashRounds: 10,
    jwt: {
        accessSecret: env.ACCESS_TOKEN_SECRET,
        accessExpire: '1d'
    },
    db: {
        host: env.DB_HOST,
        database: env.DB_DATABASE,
        username: env.DB_USERNAME,
        password: env.DB_PASSWORD,
        port: parseInt(env.DB_PORT)
    }
};

module.exports = config;