const { r2, PutObjectCommand } = require("./r2");
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
		})
	);
	// URL pública (se o bucket estiver público)
  return {
    url: `${process.env.R2_ENDPOINT}/${bucket}/${key}`,
    bucket: bucket,
    key: key
  }
}
module.exports = { uploadToR2, sanitizeFileName };