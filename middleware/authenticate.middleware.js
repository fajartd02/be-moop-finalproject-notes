const jwt = require('jsonwebtoken');
const config = require('../config/config');
const pool = require('../config/db');

async function authenticate(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];
        const accessToken = authHeader.split(' ')[1];

        console.log(accessToken);

        jwt.verify(accessToken, config.jwt.accessSecret);

        const userId = jwt.decode(accessToken).userId;
        console.log(userId);
        const user = await pool.query(
            'SELECT * FROM users WHERE id=$1;',
            [userId]
        );
        console.log(user.rows[0]);

        if (!user.rows[0].access_token) {
            return res.status(401).json({
                status: 'fail',
                message: 'Unauthorized error'
            });
        }

        return next();
    } catch (err) {
        console.log(err.message);
        return res.status(401).json({
            status: 'fail',
            message: 'Unauthorized error'
        });
    }
}

module.exports = { authenticate };