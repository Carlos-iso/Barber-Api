const dotenv = require("dotenv").config();
const { S3Client, GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});
const generateMediaUrl = async (key, minutes) => {
  const expiresInSeconds = 60 * minutes
  const objectCommand = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET,
    Key: key,
  });
  const signedUrl = await getSignedUrl(r2, objectCommand, { expiresIn: expiresInSeconds });
  return signedUrl;
}
module.exports = { r2, generateMediaUrl, PutObjectCommand };