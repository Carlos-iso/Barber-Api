"use strict";

const express = require("express");
const router = express.Router();
const controller = require("../controllers/user-controller");
const authService = require("../services/auth-service");
const upload = require("../services/multer");

router.get("/", controller.get);
router.get("/:id", controller.getById);
router.post("/new", upload.single("avatar"), controller.post); // Avatar opcional no cadastro
router.post("/login", controller.authenticate);
router.post("/refresh-token", authService.authorize, controller.refreshToken);

// Padronização e upgrade: PUT /:id com upload
router.put(
	"/:id",
	authService.authorize,
	upload.single("avatar"),
	controller.update,
);

// Mantendo compatibilidade com rota antiga se necessário, ou removendo se seguro.
router.put("/rename/:id", authService.authorize, controller.update);

router.delete("/delete/:id", authService.authorize, controller.delete);

module.exports = router;
