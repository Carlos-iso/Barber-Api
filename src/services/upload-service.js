const { r2, PutObjectCommand, DeleteObjectCommand } = require("./r2");
const path = require("path");

async function sanitizeFileName(filename) {
	const ext = path.extname(filename); // ex: ".mp4"
	const base = path.basename(filename, ext);
	return (
		base
			.toLowerCase()
			.replace(/\s+/g, "-") // troca espaços por hífen
			.replace(/[^a-z0-9\-]/g, "") + // remove caracteres inválidos
		ext.toLowerCase()
	);
}

async function uploadToR2(file) {
	const bucket = process.env.R2_BUCKET;
	const key = `${Date.now()}-${await sanitizeFileName(file.originalname)}`;

	await r2.send(
		new PutObjectCommand({
			Bucket: bucket,
			Key: key,
			Body: file.buffer,
			ContentType: file.mimetype,
		}),
	);

	// URL pública: Prioriza R2_PUBLIC_DOMAIN, senão tenta inferir ou usa endpoint padrão
	let url;
	if (process.env.R2_PUBLIC_DOMAIN) {
		url = `${process.env.R2_PUBLIC_DOMAIN}/${key}`;
	} else {
		// Fallback simples sem tentar adivinhar muito para evitar URLs quebradas
		url = `${process.env.R2_ENDPOINT}/${bucket}/${key}`;
	}

	return {
		url: url,
		bucket: bucket,
		key: key,
	};
}

async function deleteFromR2(key) {
	if (!key) return;
	try {
		const bucket = process.env.R2_BUCKET;
		await r2.send(
			new DeleteObjectCommand({
				Bucket: bucket,
				Key: key,
			}),
		);
		// console.log(`Imagem deletada do R2: ${key}`);
	} catch (error) {
		console.error(`Erro ao deletar imagem do R2 (${key}):`, error);
	}
}

module.exports = { uploadToR2, sanitizeFileName, deleteFromR2 };
