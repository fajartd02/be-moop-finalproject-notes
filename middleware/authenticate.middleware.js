const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];
        const accessToken = authHeader.split(' ')[1];

        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        return next();
    } catch (err) {
        return res.status(401).json({
            status: 'fail',
            message: 'Unauthorized error'
        });
    }
}

module.exports = { authenticate };