const express = require('express');
const router = express.Router();
const pool = require('../config/db.js');
const { createNote, getAllNotes, getNote, updateNote } = require('../controllers/notes.controller.js');


// create note
router.post("/api/v1/notes", createNote);

// get all notes
router.get("/api/v1/notes", getAllNotes);

// get specific note
router.get("/api/v1/notes/:id", getNote);

// update a note
router.put("/api/v1/notes/:id", updateNote);

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