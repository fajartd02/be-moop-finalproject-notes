const express = require('express');
const app = express();

const PORT = 3000;

app.get("api/v1/", (req, res) => {
    res.send("HEllo!");
});

app.listen(PORT, () => {
    console.log("Server running at http://localhost:" + PORT);
}); 