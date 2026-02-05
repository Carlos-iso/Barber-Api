"use strict";
const HaircutBeardStyle = require("../models/haircut-beard-style.js");
const { getVideoMetadata } = require("../utils/media.js");
const {
    uploadToR2,
    sanitizeFileName,
} = require("../services/upload-service.js");
const repository = require("../repositories/haircut-beard-repository.js");
// Criar novo anúncio
exports.createAds = async (req, res) => {
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
        const ad = {
            enterprise: req.params.advertiserId,
            titleAd: req.body.titleAd,
            descriptionAd: req.body.descriptionAd,
            media: {
                url: url,
                type: type,
                key: key,
                duration: durarion,
            },
        };
        await repository.create(ad);
        res.status(201).send({ message: "Anúncio criado!", ad });
    } catch (err) {
        res
            .status(400)
            .send({ message: "Erro ao criar anúncio", details: err.message });
    }
};