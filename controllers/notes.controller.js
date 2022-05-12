const pool = require('../config/db.js');

const createNote = async (req, res) => {
    try {
        const { title, content } = req.body;
        const newContent = await pool.query(
            `INSERT INTO note(title, content, created_at, updated_at) 
             VALUES ($1, $2, current_timestamp, current_timestamp) 
             RETURNING *`,
            [title, content]);

        res.json(newContent.rows[0]);
    } catch(err) {
        console.log(err.message);
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

module.exports = {
    createNote,
    getAllNotes,
    getNote
};