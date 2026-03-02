"use strict";

const express = require("express");
const router = express.Router();
const controller = require("../controllers/media-controller");

router.get("/public-url/:key", controller.getPublicUrl);

module.exports = router;
