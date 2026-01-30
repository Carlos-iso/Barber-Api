"use strict";

const ValidationContract = require("../validators/fluent-validator");
const repository = require("../repositories/user-repository");
const bcryptjs = require("bcryptjs");
const authService = require("../services/auth-service");

exports.get = async (req, res, next) => {
	try {
		var data = await repository.get();
		res.status(200).send(data);
	} catch (e) {
		res.status(500).send({
			message: "Falha Ao Precessar Requisição",
		});
	}
}; // Desnecessário

exports.getById = async (req, res, next) => {
	try {
		var data = await repository.getById(req.params.id);
		res.status(200).send(data);
	} catch (e) {
		res.status(500).send({
			message: "Falha Ao Precessar Requisição",
		});
	}
};

exports.post = async (req, res, next) => {
	let contract = new ValidationContract();
	contract.hasMinLen(
		req.body.name,
		3,
		"O Nome Deve Conter Pelo Manos 3 Caracteres"
	);
	contract.isEmail(req.body.email, "E-mail Inválido");
	contract.hasMinLen(
		req.body.password,
		8,
		"A Senha Deve Conter Pelo Manos 8 Caracteres"
	);

	// Se os dados forem inválidos
	if (!contract.isValid()) {
		res.status(400).send(contract.errors()).end();
		return;
	};

	try {
		//Se o usuário já existir
		const existingUser = await repository.getByEmailExist(req.body.email);
		if (existingUser) {
			res.status(409).send({
				message: "Já Existe Um Usuário Com Esse E-mail",
			});
			return;
		};
		const salt = bcryptjs.genSaltSync(10);
		const hash = bcryptjs.hash(req.body.password, salt);
		await repository.create({
			name: req.body.name,
			email: req.body.email,
			password: hash,
		});
		res.status(201).send({
			message: "Cadastro Bem Sucedido!",
		});
	} catch (e) {
		console.log(e);
		res.status(500).send({
			message: "Erro Desconhecido Tente Novamente Mais Tarde"
		});
	}
};

exports.authenticate = async (req, res, next) => {
	let contract = new ValidationContract();
	contract.isEmail(req.body.email, "E-mail Inválido");
	contract.hasMinLen(
		req.body.password,
		8,
		"A Senha Deve Conter Pelo Manos 8 Caracteres"
	);

	//Se os dados forem inválidos
	if (!contract.isValid()) {
		res.status(422).send(contract.errors()).end();
		return;
	}

	try {
		const user = await repository.authenticate({
			email: req.body.email,
			password: req.body.password,
		});

		if (!user) {
			res.status(404).send({
				message: "Usuário Ou Senha Inválido",
			});
			return;
		}

		const token = await authService.generateToken({
			id: user._id,
			email: user.email,
			name: user.name,
			role: user.role
		});

		res.status(201).send({
			message: "Login Bem Sucedido!",
			token: token,
			data: {
				_id: user._id,
				email: user.email,
				name: user.name,
				data: user.createDate
			},
		});
	} catch (e) {
		res.status(500).send({
			message: "Falha No Login!",
		});
	}
};

exports.refreshToken = async (req, res, next) => {
	try {
		const token =
			req.body.token || req.query.token || req.headers["x-access-token"];
		const data = await authService.decodeToken(token);

		const user = await repository.getById(data.id);

		if (!user) {
			res.status(404).send({
				message: "Token Não Encontrado!",
			});
			return;
		}

		const tokenData = await authService.generateToken({
			id: user._id,
			email: user.email,
			name: user.name,
			role: user.role,
		});

		res.status(201).send({
			token: tokenData,
			data: {
				email: user.email,
				name: user.name,
			},
		});
	} catch (e) {
		res.status(500).send({
			message: "Falha No Token!",
		});
	}
};

exports.put = async (req, res, next) => {
	try {
		await repository.update(req.params.id, req.body);
		res.status(200).send({
			message: "Dados Alterados Com Sucesso!",
		});
	} catch (e) {
		res.status(500).send({
			message: "Falha Ao Alterar Dados!",
		});
	}
};

exports.delete = async (req, res, next) => {
	try {
		await repository.delete(req.body.id);
		res.status(200).send({
			message: "Conta Exclúida Com Sucesso!",
		});
	} catch (e) {
		res.status(500).send({
			message: "Falha Ao Excluír Conta!",
		});
	}
};
