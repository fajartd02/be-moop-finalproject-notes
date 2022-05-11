const express = require('express');
const router = express.Router();

router.get("/api/v1", (req, res) => {
    res.send("HEllo!");
});

module.exports = router;