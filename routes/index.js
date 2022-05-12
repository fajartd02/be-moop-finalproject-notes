const express = require('express');
const router = express.Router();
const pool = require('../config/db.js');
const { createNote } = require('../controllers/notes.controller.js');


// create note
router.post("/api/v1/notes", createNote);

// get all notes
router.get("/api/v1/notes", async (req, res) => {
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
});

// get specific note
router.get("/api/v1/notes/:id", async(req, res) => {
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

        res.json({message: "Todo was successfully updated!"});
    } catch(err) {
        console.log(err.message);
    }
});

// delete a todo
router.delete("/api/v1/notes/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const deleteNote = await pool.query(
            `DELETE FROM note WHERE note_id = $1`, [id]);
        
        res.json({message: "Todo was successfully deleted!"})
    } catch(err) {
        console.log(err.message);
    }
})

module.exports = router;