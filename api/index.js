const express = require("express");
const app = express();

app.get("/", (req, res) => res.send("Express on Vercel workd!"));

app.listen(4000, () => console.log("Server ready on port 3000."));

module.exports = app;
