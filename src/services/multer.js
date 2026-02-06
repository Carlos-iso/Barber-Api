const multer = require("multer");
const path = require("path");
const storage = multer.memoryStorage();
const allowedExt = [".jpg", ".jpeg", ".png", ".webp", ".mp4", ".mpeg", ".mov"];
const allowedMime = ["image/", "video/"];
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // até 50MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype.toLowerCase();
    const isExtAllowed = allowedExt.includes(ext);
    const isMimeAllowed =
      allowedMime.some((prefix) => mime.startsWith(prefix));
    // se for application/octet-stream mas a extensão estiver ok -> aceita
    if (mime === "application/octet-stream" && isExtAllowed) {
      return cb(null, true);
    }
    if (isExtAllowed && isMimeAllowed) {
      return cb(null, true);
    }
    cb(new Error("Arquivo não suportado"));
  },
});
module.exports = upload;