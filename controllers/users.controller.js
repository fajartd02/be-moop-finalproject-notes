const bcrypt = require('bcrypt');
const pool = require('../config/db');
const jwt = require('jsonwebtoken');

const addNewUser = async (req, res) => {
    const { username, password, fullName } = req.body;

    try {
        const userExist = await pool.query('SELECT * FROM users WHERE username=$1;', [username]);
        if (userExist.rowCount) {
            return res.status(400).json({
                status: 'fail',
                message: 'This account is already exist'
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: 'fail',
            message: 'Unexpected server error'
        });
    }

    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    try {
        await pool.query(`INSERT INTO users (username, password, full_name)
        VALUES ($1, $2, $3);`,
        [username, hashedPassword, fullName]
        );

        return res.status(200).json({
            status: 'success',
            message: 'Successfully registered a new account'
        });
    } catch (error) {
        return res.status(500).json({
            status: 'fail',
            message: 'Unexpected server error'
        });
    }
};

const loginUser = async (req, res) => {
    const { username, password } = req.body;
    let user;

    try {
        user = await pool.query('SELECT * FROM users WHERE username=$1;', [username]);
        if (!user.rows.length) {
            return res.status(400).json({
                status: 'fail',
                message: 'Account doesn\'t exist'
            });
        }

        if (!bcrypt.compareSync(password, user.rows[0].password)) {
            return res.status(400).json({
                status: 'fail',
                message: 'Object or value is invalid'
            });
        }

        const payload = {
            userId: user.rows[0].user_id,
            username: user.rows[0].username
        };

        const accessToken = jwt.sign(
            payload,
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        return res.status(200).json({
            status: 'success',
            message: 'Successfully login',
            data: {
                accessToken
            }
        });
    } catch (error) {
        return res.status(500).json({
            status: 'fail',
            message: 'Unexpected server error'
        });
    }
}

const logoutUser = async (req, res) => {
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
            return res.status(204).json({
                status: 'success',
                message: 'Successfully logout'
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: 'fail',
            message: 'Unexpected server error'
        });
    }

    const userId = user.rows[0].user_id;
    try {
        await pool.query('UPDATE users SET refresh_token=NULL WHERE user_id=$1;', [userId]);
        res.clearCookie('refreshToken');
        return res.status(200).json({
            status: 'success',
            message: 'Successfully logout'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'fail',
            message: 'Unexpected server error'
        });
    }
}

module.exports = {
    addNewUser,
    loginUser,
    logoutUser
};