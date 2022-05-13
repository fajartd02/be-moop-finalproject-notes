const bcrypt = require('bcrypt');
const pool = require('../config/db');

const addNewUser = async (req, res) => {
    const { username, password, fullName } = req.body;

    try {
        const userExist = await pool.query('SELECT * FROM users WHERE username=$1;', [username]);
        if (userExist.rows.length) {
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
        console.log("error");
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
            userId: user.rows[0].id,
            username: user.rows[0].username
        };

        const accessToken = jwt.sign(
            payload,
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '5m' }
        );

        const refreshToken = jwt.sign(
            payload,
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        await pool.query('UPDATE users SET refresh_token=$1 WHERE user_id=$2;',
            [refreshToken, payload.userId]);

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

module.exports = {
    addNewUser,
    loginUser
};