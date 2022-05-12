const express = require('express');
const router = express.Router();
const pool = require('../config/db.js');


// create note
router.post("/api/v1/notes", async (req, res) => {
    try {
        const { title, content } = req.body;
        const newContent = await pool.query(
            "INSERT INTO note(title, content, created_at, updated_at) VALUES ($1, $2, current_timestamp, current_timestamp) RETURNING *",
            [title, content]);

        res.json(newContent.rows[0]);
    } catch(err) {
        console.log(err.message);
    }
});

module.exports = router;