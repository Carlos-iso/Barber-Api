"use strict";
const express = require("express");
const router = express.Router();
const upload = require("../services/multer.js");
const controller = require("../controllers/haircut-beard-controller.js");
const authService = require("../services/auth-service.js"); // Apenas usuários autenticados podem criar, atualizar ou deletar anúncios
router.get("/", controller.listUploads);
router.post("/search", controller.getByName);
router.post(
  "/:advertiserId/new",
  upload.single("media"),
  controller.createAds
);
router.put("/:id/update", upload.single("media"), controller.updatePut);
router.delete("/:id/delete", controller.remove);
// router.post("/:driverId/start", controller.startAdsForDriver);
router.post("/:driverId/stop", controller.stopAdsForDriver);
module.exports = router;