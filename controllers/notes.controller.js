const pool = require('../config/db.js');
const jwt = require('jsonwebtoken');

const createNote = async (req, res) => {
    const { title, content } = req.body;
    const token = req.headers['authorization'].split(' ')[1];
    const userId = jwt.decode(token).userId;
    console.log(userId);

    try {
        const newNote = await pool.query(
            `INSERT INTO notes (user_id, title, content, created_at, updated_at)
             VALUES ($1, $2, $3, current_timestamp, current_timestamp)
             RETURNING *`,
            [userId, title, content]);

        return res.status(200).json({
            status: 'success',
            message: 'Successfully registered a new account',
            data: {
                note: newNote.rows[0]
            }
        });
    } catch(err) {
        console.log(err);
        return res.status(500).json({
            status: 'fail',
            message: 'Unexpected server error'
        });
    }
};

const getAllNotes = async (req, res) => {
    try {
        const allNotes = await pool.query(
            `SELECT note_id as id, title, content,
            to_char(created_at, 'yyyymmdd hh:mi:ss') as created_at,
            to_char(updated_at, 'yyyymmdd hh:mi:ss') as updated_at
            FROM note`);

        if(allNotes.rowCount === 0) {
            res.json({message: "Database not have some data!"});
        }

        res.json(allNotes.rows);
    } catch(err) {
        console.log(err.message);
    }
}

const getNote = async(req, res) => {
    try {
        const { id } = req.params;
        const note = await pool.query(`SELECT note_id as id, title, content,
        to_char(created_at, 'yyyymmdd hh:mi:ss') as created_at,
        to_char(updated_at, 'yyyymmdd hh:mi:ss') as updated_at
        FROM note WHERE note_id = $1`, [id]);

        if(note.rowCount == 0) {
            res.json({message: "Data with this id doesn't exists!"});
        }
        res.json(note.rows[0]);
    } catch(err) {
        console.log(err.message);
    }
}

const updateNote = async(req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        const updateNote = await pool.query(
            `UPDATE note SET title = $1, content = $2,
            updated_at = current_timestamp
            WHERE note_id = $3`,
            [title, content, id]
        );

        res.json({message: "Todo was successfully updated!"});
    } catch(err) {
        console.log(err.message);
    }
}

const deleteNote = async(req, res) => {
    try {
        const { id } = req.params;
        const deleteNote = await pool.query(
            `DELETE FROM note WHERE note_id = $1`, [id]);

        res.json({message: "Todo was successfully deleted!"})
    } catch(err) {
        console.log(err.message);
    }
}

module.exports = {
    createNote,
    getAllNotes,
    getNote,
    updateNote,
    deleteNote
};