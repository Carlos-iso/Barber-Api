"use strict";
const express = require("express");
const router = express.Router();
const upload = require("../services/multer.js");
const controller = require("../controllers/finish-styles-controller.js");
const authService = require("../services/auth-service.js"); // Apenas usuários autenticados podem criar, atualizar ou deletar anúncios
router.get("/", controller.listUploads);
router.post("/search", controller.getByName);
router.post(
    "/:adminId/new",
    upload.single("defaultImage"),
    controller.uploadFile
);
// router.put("/:id/update", upload.single("defaultImage"), controller.updatePut);
// router.delete("/:id/delete", controller.remove);
module.exports = router;