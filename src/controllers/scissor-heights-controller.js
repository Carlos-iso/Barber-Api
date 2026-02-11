"use strict";
const { getVideoMetadata } = require("../utils/media.js");
const {
	uploadToR2,
	sanitizeFileName,
} = require("../services/upload-service.js");
const repository = require("../repositories/scissor-heights-repository.js");
// Criar uploand file
exports.uploadFile = async (req, res) => {
	try {
		if (!req.file) {
			return res
				.status(400)
				.send({ message: "Necessário enviar um arquivo de mídia" });
		}
		let type = null;
		const { key, url, bucket } = await uploadToR2(req.file);
		const videoInfo = await getVideoMetadata(req.file.buffer);
		const track = videoInfo.media?.track?.find(
			(t) => t["@type"] === "Video" || t["@type"] === "Image"
		);
		const durarion = videoInfo.media?.track?.find(
			(t) => t["@type"] === "General"
		).Duration;
		if (!track) {
			res
				.status(404)
				.send({ message: "Não foi possível identificar tipo de mídia" });
		}
		type = `${track["@type"]}/${track.Format}`;
		const upload = {
			user: req.params.adminId,
			id: req.body.id,
			label: req.body.name,
			icon: req.body.icon,
			defaultImage: {
				url: url,
				type: type,
				key: key,
			},
		};
		await repository.create(upload);
		res.status(201).send({ message: "Upload criado!", upload });
	} catch (err) {
		res
			.status(400)
			.send({ message: "Erro ao criar upload", details: err.message });
	}
};
// Lista apenas metadodos dos uploads
exports.listUploads = async (req, res) => {
	try {
		var data = await repository.get();
		res.status(200).send(data);
	} catch (err) {
		res
			.status(500)
			.send({ message: "Erro ao buscar upload", details: err.message });
	}
};

// Buscar por nome uploads
exports.getByName = async (req, res) => {
	try {
		const idUpload = await repository.getByLabel(req.body.name);
		if (idUpload == null) {
			return res.status(404).send({ message: "Upload não encontrado!" });
		}
		return res.status(200).send({ message: "ID encontrado!", idUpload });
	} catch (err) {
		return res
			.status(409)
			.send({ message: "Erro inesperado", details: err.message });
		// rever mensagem de erro
	}
}