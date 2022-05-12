const express = require('express');
const router = express.Router();
const pool = require('../config/db.js');


// create note
router.post("/api/v1/notes", async (req, res) => {
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
});

// get all notes
router.get("/api/v1/notes", async (req, res) => {
    try {
        const allNotes = await pool.query(
            `SELECT note_id as id, title, content, 
            to_char(created_at, 'yyyymmdd hh:mi:ss') as created_at, 
            to_char(updated_at, 'yyyymmdd hh:mi:ss') as updated_at 
            FROM note`);
        res.json(allNotes.rows);
    } catch(err) {
        console.log(err.message);
    }
});

// get specific note
router.get("/api/v1/notes/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const note = await pool.query(`SELECT note_id as id, title, content, 
        to_char(created_at, 'yyyymmdd hh:mi:ss') as created_at, 
        to_char(updated_at, 'yyyymmdd hh:mi:ss') as updated_at 
        FROM note WHERE note_id = $1`, [id]);

        res.json(note.rows[0]);
    } catch(err) {
        console.log(err.message);
    }
})

// update a note
router.put("/api/v1/notes/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        const updateNote = await pool.query(
            `UPDATE note SET title = $1, content = $2, 
            updated_at = current_timestamp 
            WHERE note_id = $3`,
            [title, content, id]
        );

        res.json({message: "Todo Successfully Updated!"});
    } catch(err) {
        console.log(err.message);
    }
});

module.exports = router;