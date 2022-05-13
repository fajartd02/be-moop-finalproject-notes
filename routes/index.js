const express = require('express');
const router = express.Router();
const pool = require('../config/db.js');
const {
    createNote,
    getAllNotes,
    getNote,
    updateNote,
    deleteNote
} = require('../controllers/notes.controller.js');
const { addNewUser, loginUser } = require('../controllers/users.controller.js');

// create new user
router.post('/api/v1/users/add', addNewUser);

// login user
router.post('/api/v1/users/login', loginUser);

// create note
router.post("/api/v1/notes/add", createNote);

// get all notes
router.get("/api/v1/notes", getAllNotes);

// get specific note
router.get("/api/v1/notes/:id", getNote);

// update a note
router.put("/api/v1/notes/:id", updateNote);

// delete a todo
router.delete("/api/v1/notes/:id", deleteNote);

module.exports = router;