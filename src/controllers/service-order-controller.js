"use strict";

const repository = require("../repositories/service-order-repository");
const ValidationContract = require("../validators/fluent-validator");
const userRepository = require("../repositories/user-repository");

exports.post = async (req, res, next) => {
	let contract = new ValidationContract();
	contract.hasMinLen(
		req.body.customerName,
		3,
		"O nome do cliente deve ter pelo menos 3 caracteres",
	);
	contract.isRequired(req.body.totalPrice, "O preço total é obrigatório");

	if (!contract.isValid()) {
		res.status(400).send(contract.errors()).end();
		return;
	}

	try {
		// Assume que o ID do barbeiro vem do token (req.user_id ou similar) ou do body
		// Aqui vamos pegar do token decodificado pelo middleware de auth (req.user)
		// Se o middleware salvar em req.user.id
		const barberId = req.user.id || req.user._id || req.body.barberId;

		const createdOrder = await repository.create({
			customerName: req.body.customerName,
			date: req.body.date,
			status: req.body.status,
			totalPrice: req.body.totalPrice,
			barberId: barberId,
			services: req.body.services, // Espera array de objetos { name, price }
		});

		if (barberId) {
			await userRepository.incrementAttendanceCount(barberId);
		}

		res.status(201).send({
			message: "Ordem de Serviço criada com sucesso!",
			data: createdOrder,
		});
	} catch (e) {
		console.log(e);
		res.status(500).send({ message: "Falha ao processar sua requisição" });
	}
};

exports.get = async (req, res, next) => {
	try {
		const barberId = req.user.id || req.user._id; // Filtra pelo barbeiro logado
		const data = await repository.get(barberId);
		res.status(200).send(data);
	} catch (e) {
		res.status(500).send({ message: "Falha ao processar sua requisição" });
	}
};

exports.getById = async (req, res, next) => {
	try {
		const data = await repository.getById(req.params.id);
		res.status(200).send(data);
	} catch (e) {
		res.status(500).send({ message: "Falha ao processar sua requisição" });
	}
};

exports.update = async (req, res, next) => {
	try {
		await repository.update(req.params.id, req.body);
		res
			.status(200)
			.send({ message: "Ordem de Serviço atualizada com sucesso!" });
	} catch (e) {
		res.status(500).send({ message: "Falha ao processar sua requisição" });
	}
};

exports.delete = async (req, res, next) => {
	try {
		await repository.delete(req.params.id);
		res.status(200).send({ message: "Ordem de Serviço removida com sucesso!" });
	} catch (e) {
		res.status(500).send({ message: "Falha ao processar sua requisição" });
	}
};
