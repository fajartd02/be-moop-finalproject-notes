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
const { addNewUser, loginUser, logoutUser } = require('../controllers/users.controller.js');
const { authenticate } = require('../middleware/authenticate.middleware.js');

router.get("/api/v1/notes", authenticate, getAllNotes);
router.get("/api/v1/notes/:id", authenticate, getNote);

router.post('/api/v1/register', addNewUser);
router.post('/api/v1/login', loginUser);
router.post("/api/v1/notes", authenticate, createNote);

router.put("/api/v1/notes/:id", authenticate, updateNote);

router.delete('/api/v1/users/logout', authenticate, logoutUser);
router.delete("/api/v1/notes/:id", authenticate, deleteNote);

module.exports = router;