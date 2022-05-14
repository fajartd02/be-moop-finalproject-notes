const pool = require('../config/db');
const jwt = require('jsonwebtoken');

const refreshAcessToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    let user;
    if(!refreshToken) {
        return res.status(401).json({
            status: 'fail',
            message: 'Unauthorized error'
        });
    }

    try {
        user = await pool.query('SELECT * FROM users WHERE refresh_token=$1;', [refreshToken]);
        if (user.rowCount === 0) {
            return res.status(401).json({
                status: 'fail',
                message: 'Unauthorized error'
            });
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, decoded) => {
            if (error) {
                return res.status(401).json({
                    status: 'fail',
                    message: 'Unauthorized error'
                });
            }

            const payload = {
                userId: user.rows[0].user_id,
                username: user.rows[0].username
            };

            const accessToken = jwt.sign(
                payload,
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '25m' }
            );

            return res.status(200).json({
                status: 'success',
                message: 'Successfully refresh access token',
                data: {
                    accessToken
                }
            });
        })
    } catch (error) {
        return res.status(500).json({
            status: 'fail',
            message: 'Unexpected server error'
        });
    }
}

module.exports = {
    refreshAcessToken
};