"use strict";
const { getVideoMetadata } = require("../utils/media.js");
const {
	uploadToR2,
	sanitizeFileName,
} = require("../services/upload-service.js");
const repository = require("../repositories/beard-contours-repository.js");
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
			(t) => t["@type"] === "Video" || t["@type"] === "Image",
		);
		const durarion = videoInfo.media?.track?.find(
			(t) => t["@type"] === "General",
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
			label: req.body.label,
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
const authService = require("../services/auth-service");
const { generateMediaUrl } = require("../services/r2");

// Lista apenas metadodos dos uploads
exports.listUploads = async (req, res) => {
	try {
		var data = await repository.get();

		// Check for token to decide if we verify/sign URLs
		const token =
			req.body.token || req.query.token || req.headers["x-access-token"];

		if (token) {
			try {
				await authService.decodeToken(token); // Verify token validity

				// If we get here, token is valid. Generate signed URLs.
				// Note: repository.get() returns Mongoose documents. We might need to convert to object to modify safely,
				// or modify the document if allowed. safely is to map to object.
				// But mongoose find() usually returns Model instances.
				// Let's rely on mapping.

				const dataWithSignedUrls = await Promise.all(
					data.map(async (item) => {
						const itemObj = item.toObject ? item.toObject() : item; // Ensure plain object
						if (itemObj.defaultImage && itemObj.defaultImage.key) {
							try {
								const signedUrl = await generateMediaUrl(
									itemObj.defaultImage.key,
									60,
								); // 60 minutes
								itemObj.defaultImage.url = signedUrl;
							} catch (err) {
								console.error(
									`Error signing URL for item ${itemObj._id}:`,
									err,
								);
								// Keep original URL on error
							}
						}
						return itemObj;
					}),
				);

				return res.status(200).send(dataWithSignedUrls);
			} catch (e) {
				// Token invalid or expired - return public URLs (original data)
				// console.log("Invalid token for signed URLs, returning public");
			}
		}

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
};
