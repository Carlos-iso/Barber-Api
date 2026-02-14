"use strict";
const express = require("express");
const router = express.Router();
const upload = require("../services/multer.js");
const controller = require("../controllers/beard-contours-controller.js");
const authService = require("../services/auth-service.js");

// Public Routes
router.get("/", controller.listUploads);
router.get("/:id", controller.getById);
router.post("/search", controller.getByName);

// Protected Routes
router.post(
	"/:adminId/new",
	upload.single("defaultImage"),
	controller.uploadFile,
);

router.put("/:id", upload.single("defaultImage"), controller.update);

router.delete("/:id", controller.delete);

module.exports = router;
