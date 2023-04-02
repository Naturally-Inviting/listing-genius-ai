const express = require("express");
const router = express.Router();
const { getDescriptionText } = require("../controllers/description");

router.post("/", getDescriptionText);

module.exports = router;
