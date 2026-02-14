"use strict";
const { getVideoMetadata } = require("../utils/media.js");
const {
	uploadToR2,
	sanitizeFileName,
	deleteFromR2,
} = require("../services/upload-service.js");
const repository = require("../repositories/beard-contours-repository.js");

// CREATE (Upload + Save)
exports.uploadFile = async (req, res) => {
	try {
		// Validação básica
		if (!req.file) {
			return res
				.status(400)
				.send({ message: "Necessário enviar um arquivo de mídia" });
		}

		// Upload para o R2
		const { key, url, bucket } = await uploadToR2(req.file);

		// Metadata do vídeo/imagem
		let type = null;
		try {
			const videoInfo = await getVideoMetadata(req.file.buffer);
			const track = videoInfo.media?.track?.find(
				(t) => t["@type"] === "Video" || t["@type"] === "Image",
			);

			if (track) {
				type = `${track["@type"]}/${track.Format}`;
			} else {
				type = req.file.mimetype; // Fallback para mimetype do multer
			}
		} catch (e) {
			type = req.file.mimetype; // Fallback se getVideoMetadata falhar
		}

		// Monta objeto para salvar
		const upload = {
			user: req.params.adminId, // Atenção: verificar se adminId vem da rota ou token
			id: req.body.id,
			label: req.body.label,
			icon: req.body.icon,
			defaultImage: {
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
		// Não é mais necessário assinar URLs pois elas são públicas
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

		// Se houver arquivo novo, faz upload e substitui
		if (req.file) {
			const { key, url } = await uploadToR2(req.file);

			// Metadata da nova imagem
			let type = req.file.mimetype;
			try {
				const videoInfo = await getVideoMetadata(req.file.buffer);
				const track = videoInfo.media?.track?.find(
					(t) => t["@type"] === "Video" || t["@type"] === "Image",
				);
				if (track) type = `${track["@type"]}/${track.Format}`;
			} catch (e) {}

			// Atualiza dados da imagem
			updateData.defaultImage = {
				url: url,
				type: type,
				key: key,
			};

			// Remove imagem antiga do R2
			if (currentItem.defaultImage && currentItem.defaultImage.key) {
				await deleteFromR2(currentItem.defaultImage.key);
			}
		}

		// Remove campos undefined para não sobrescrever com null
		Object.keys(updateData).forEach(
			(key) => updateData[key] === undefined && delete updateData[key],
		);

		await repository.update(id, updateData);

		// Retorna item atualizado
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

		// Remove imagem do R2
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

// Mantido para compatibilidade (busca por nome/label)
exports.getByName = async (req, res) => {
	try {
		// Repository foi ajustado para getByLabel
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
