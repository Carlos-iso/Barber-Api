"use strict";

const { generateMediaUrl } = require("../services/r2");

exports.getPublicUrl = async (req, res) => {
	try {
		const key = req.params.key;
		if (!key) {
			return res.status(400).send({ message: "Chave de mídia é obrigatória" });
		}

		const signedUrl = await generateMediaUrl(key, 30);
		return res.status(200).send({ url: signedUrl });
	} catch (err) {
		console.error(err);
		return res
			.status(500)
			.send({ message: "Erro ao gerar URL assinada", details: err.message });
	}
};
