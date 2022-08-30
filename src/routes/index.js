const express = require("express");
const router = express.Router();
const path = require("path");

const views = path.join(__dirname, "/../views");

router.get("/", (req, res) => {
    res.sendFile(views + "/index.html");
});

router.get("/adm", (req, res) => {
    res.sendFile(views + "/adm.html")
});

router.get("/frontend", (req, res) => {
    res.sendFile(views + "/home.html")
});

module.exports = router;