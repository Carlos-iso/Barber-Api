"use strict";
const express = require("express");
const router = express.Router();
const upload = require("../services/multer.js");
const controller = require("../controllers/cutting-methods-controller.js");
const authService = require("../services/auth-service.js");

router.get("/", controller.listUploads);
router.get("/:id", controller.getById);
router.post("/search", controller.getByName);

router.post(
	"/:adminId/new",
	upload.single("backgroundImage"),
	controller.uploadFile,
);

router.put("/:id", upload.single("backgroundImage"), controller.update);

router.delete("/:id", controller.delete);

module.exports = router;
