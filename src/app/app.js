"use strict";

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const config = require("./config");
const dotenv = require("dotenv").config();

const app = express();
const router = express.Router();

//Conectar ao banco mongodb
mongoose.connect(config.connectionString);

//Carregar models
const User = require("../models/user");
const HaircutStyle = require("../models/haircut-style");
const BeardStyle = require("../models/beard-style");
const CuttingMethods = require("../models/cutting-methods");
const MachineHeights = require("../models/machine-heights");
const ScissorHeights = require("../models/scissor-heights");
const SideStyles = require("../models/side-styles");
const FinishStyles = require("../models/finish-styles");
const BeardHeights = require("../models/beard-heights");
const BeardContours = require("../models/beard-contours");
const FadeTypes = require("../models/fade-types");

//Carregar Rotas
const indexRoutes = require("../routes/index-routes");
const userRoutes = require("../routes/user-routes");
const haircutRoutes = require("../routes/haircut-routes");
const beardRoutes = require("../routes/beard-routes");
const cuttingMethodsRoutes = require("../routes/cutting-methods-routes");
const machineHeightsRoutes = require("../routes/machine-heights-routes");
const scissorHeightsRoutes = require("../routes/scissor-heights-routes");
const sideStylesRoutes = require("../routes/side-styles-routes");
const finishStylesRoutes = require("../routes/finish-styles-routes");
const beardHeightsRoutes = require("../routes/beard-heights-routes");
const beardContoursRoutes = require("../routes/beard-contours-routes");
const fadeTypesRoutes = require("../routes/fade-types-routes");

//Chama As Variaveis De Ambiente
const urlHome = process.env.URL_HOME;
const urlLogin = process.env.URL_LOGIN;
const urlCadastro = process.env.URL_CADASTRO;

// Habilita O CORS
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"*Origen, X-Requested-With, Content-Type, Accept, x-access-token",
	);
	res.header(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD",
	);
	next();
});
app.use(cors());

app.use(
	bodyParser.json({
		limit: "5mb",
	}),
);
app.use(
	bodyParser.urlencoded({
		extended: false,
	}),
);

app.use("/", indexRoutes);
app.use("/user", userRoutes);
app.use("/haircut", haircutRoutes);
app.use("/beard", beardRoutes);
app.use("/cutting-methods", cuttingMethodsRoutes);
app.use("/machine-heights", machineHeightsRoutes);
app.use("/scissor-heights", scissorHeightsRoutes);
app.use("/side-styles", sideStylesRoutes);
app.use("/finish-styles", finishStylesRoutes);
app.use("/beard-heights", beardHeightsRoutes);
app.use("/beard-contours", beardContoursRoutes);
app.use("/fade-types", fadeTypesRoutes);

module.exports = app;
