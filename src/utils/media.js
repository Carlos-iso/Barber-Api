const { mediaInfoFactory } = require("mediainfo.js");
async function getVideoMetadata(buffer) {
  const mediainfo = await mediaInfoFactory({ format: "object" });
  const info = await mediainfo.analyzeData(() => buffer.length, (size, offset) =>
    buffer.slice(offset, offset + size)
  );
  return info;
}
module.exports = { getVideoMetadata }