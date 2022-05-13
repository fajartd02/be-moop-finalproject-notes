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
const { authenticate } = require('../middleware/authenticate.middleware.js');

// create new user
router.post('/api/v1/users/add', addNewUser);

// login user
router.post('/api/v1/users/login', loginUser);

// create note
router.post("/api/v1/notes/add", authenticate, createNote);

// get all notes
router.get("/api/v1/notes", authenticate, getAllNotes);

// get specific note
router.get("/api/v1/notes/:id", authenticate, getNote);

// update a note
router.put("/api/v1/notes/:id", authenticate, updateNote);

// delete a todo
router.delete("/api/v1/notes/:id", deleteNote);

module.exports = router;