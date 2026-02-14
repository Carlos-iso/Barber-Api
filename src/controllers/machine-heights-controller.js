"use strict";
const { getVideoMetadata } = require("../utils/media.js");
const {
	uploadToR2,
	sanitizeFileName,
	deleteFromR2,
} = require("../services/upload-service.js");
const repository = require("../repositories/machine-heights-repository.js");

// CREATE (Upload + Save)
exports.uploadFile = async (req, res) => {
	try {
		if (!req.file) {
			return res
				.status(400)
				.send({ message: "Necessário enviar um arquivo de mídia" });
		}

		const { key, url, bucket } = await uploadToR2(req.file);

		// Metadata
		let type = req.file.mimetype;
		try {
			const videoInfo = await getVideoMetadata(req.file.buffer);
			const track = videoInfo.media?.track?.find(
				(t) => t["@type"] === "Video" || t["@type"] === "Image",
			);
			if (track) type = `${track["@type"]}/${track.Format}`;
		} catch (e) {}

		const upload = {
			user: req.params.adminId,
			id: req.body.id,
			label: req.body.label, // MachineHeights usa label
			icon: req.body.icon,
			defaultImage: {
				// MachineHeights usa defaultImage
				url: url,
				type: type,
				key: key,
			},
		};

		const data = await repository.create(upload);
		res.status(201).send({ message: "Upload criado!", upload: data });
	} catch (err) {
		console.error(err);
		res
			.status(400)
			.send({ message: "Erro ao criar upload", details: err.message });
	}
};

// READ (List All)
exports.listUploads = async (req, res) => {
	try {
		const data = await repository.get();
		res.status(200).send(data);
	} catch (err) {
		res
			.status(500)
			.send({ message: "Erro ao buscar uploads", details: err.message });
	}
};

// READ (Get By ID)
exports.getById = async (req, res) => {
	try {
		const data = await repository.getById(req.params.id);
		if (!data) {
			return res.status(404).send({ message: "Item não encontrado" });
		}
		res.status(200).send(data);
	} catch (err) {
		res
			.status(500)
			.send({ message: "Erro ao buscar item", details: err.message });
	}
};

// UPDATE (Put)
exports.update = async (req, res) => {
	try {
		const id = req.params.id;
		const currentItem = await repository.getById(id);

		if (!currentItem) {
			return res
				.status(404)
				.send({ message: "Item não encontrado para atualização" });
		}

		let updateData = {
			id: req.body.id,
			label: req.body.label,
			icon: req.body.icon,
		};

		if (req.file) {
			const { key, url } = await uploadToR2(req.file);

			let type = req.file.mimetype;
			try {
				const videoInfo = await getVideoMetadata(req.file.buffer);
				const track = videoInfo.media?.track?.find(
					(t) => t["@type"] === "Video" || t["@type"] === "Image",
				);
				if (track) type = `${track["@type"]}/${track.Format}`;
			} catch (e) {}

			updateData.defaultImage = {
				url: url,
				type: type,
				key: key,
			};

			if (currentItem.defaultImage && currentItem.defaultImage.key) {
				await deleteFromR2(currentItem.defaultImage.key);
			}
		}

		Object.keys(updateData).forEach(
			(key) => updateData[key] === undefined && delete updateData[key],
		);

		await repository.update(id, updateData);

		const updatedItem = await repository.getById(id);
		res
			.status(200)
			.send({ message: "Item atualizado com sucesso", data: updatedItem });
	} catch (err) {
		console.error(err);
		res
			.status(500)
			.send({ message: "Erro ao atualizar item", details: err.message });
	}
};

// DELETE
exports.delete = async (req, res) => {
	try {
		const id = req.params.id;
		const deletedItem = await repository.delete(id);

		if (!deletedItem) {
			return res.status(404).send({ message: "Item não encontrado" });
		}

		if (deletedItem.defaultImage && deletedItem.defaultImage.key) {
			await deleteFromR2(deletedItem.defaultImage.key);
		}

		res.status(200).send({ message: "Item removido com sucesso" });
	} catch (err) {
		res
			.status(500)
			.send({ message: "Erro ao remover item", details: err.message });
	}
};

exports.getByName = async (req, res) => {
	try {
		// getByLabel
		const idUpload = await repository.getByLabel(req.body.name);
		if (idUpload == null) {
			return res.status(404).send({ message: "Upload não encontrado!" });
		}
		return res.status(200).send({ message: "ID encontrado!", idUpload });
	} catch (err) {
		return res
			.status(409)
			.send({ message: "Erro inesperado", details: err.message });
	}
};
