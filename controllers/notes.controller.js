const pool = require('../config/db.js');
const jwt = require('jsonwebtoken');

const createNote = async (req, res) => {
    const { title, content } = req.body;
    const token = req.headers['authorization'].split(' ')[1];
    const userId = jwt.decode(token).userId;

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
        return res.status(500).json({
            status: 'fail',
            message: 'Unexpected server error'
        });
    }
};

const getAllNotes = async (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];
    const userId = jwt.decode(token).userId;

    try {
        const notes = await pool.query(
            `SELECT id, title, content,
            to_char(created_at, 'yyyymmdd hh:mi:ss') as created_at,
            to_char(updated_at, 'yyyymmdd hh:mi:ss') as updated_at
            FROM notes WHERE user_id=$1;`, [userId]);

        return res.status(200).json({
            status: 'success',
            message: 'Successfully get all notes',
            data: {
                notes: notes.rows
            }
        });
    } catch(err) {
        return res.status(500).json({
            status: 'fail',
            message: 'Unexpected server error'
        });
    }
}

const getNote = async(req, res) => {
    const { id } = req.params;
    const token = req.headers['authorization'].split(' ')[1];
    const userId = jwt.decode(token).userId;

    try {
        const note = await pool.query(`SELECT id, title, content,
        to_char(created_at, 'yyyymmdd hh:mi:ss') as created_at,
        to_char(updated_at, 'yyyymmdd hh:mi:ss') as updated_at
        FROM notes WHERE user_id=$1 AND id = $2`, [userId, id]);

        if(note.rowCount === 0) {
            return res.status(404).json({
                status: 'fail',
                message: 'Note not found'
            });
        }
        return res.status(200).json({
            status: 'success',
            message: 'Successfully get note',
            data: {
                note: note.rows[0]
            }
        });
    } catch(err) {
        console.log(err);
        return res.status(500).json({
            status: 'fail',
            message: 'Unexpected server error'
        });
    }
}

const updateNote = async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const token = req.headers['authorization'].split(' ')[1];
    const userId = jwt.decode(token).userId;

    try {
        const updatedNote = await pool.query(
            `UPDATE notes SET title = $1, content = $2,
            updated_at = current_timestamp
            WHERE user_id = $3 AND id = $4 RETURNING *;`,
            [title, content, userId, id]
        );

        if (updatedNote.rowCount === 0) {
            return res.status(404).json({
                status: 'fail',
                message: 'Note not found'
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Successfully update note'
        });
    } catch(err) {
        return res.status(500).json({
            status: 'fail',
            message: 'Unexpected server error'
        });
    }
}

const deleteNote = async(req, res) => {
    const { id } = req.params;
    const token = req.headers['authorization'].split(' ')[1];
    const userId = jwt.decode(token).userId;

    try {
        const deletedNote = await pool.query(
            `DELETE FROM notes WHERE user_id = $1 AND id = $2;`, [userId, id]);

        if (deletedNote.rowCount === 0) {
            return res.status(404).json({
                status: 'fail',
                message: 'Note not found'
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Successfully delete note'
        });
    } catch(err) {
        return res.status(500).json({
            status: 'fail',
            message: 'Unexpected server error'
        });
    }
}

module.exports = {
    createNote,
    getAllNotes,
    getNote,
    updateNote,
    deleteNote
};