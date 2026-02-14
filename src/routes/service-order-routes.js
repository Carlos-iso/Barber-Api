"use strict";

const express = require("express");
const router = express.Router();
const controller = require("../controllers/service-order-controller");
const authService = require("../services/auth-service");

// Todas as rotas protégidas por autenticação
router.get("/", authService.authorize, controller.get);
router.get("/:id", authService.authorize, controller.getById);
router.post("/", authService.authorize, controller.post);
router.put("/:id", authService.authorize, controller.update);
router.delete("/:id", authService.authorize, controller.delete);

module.exports = router;
