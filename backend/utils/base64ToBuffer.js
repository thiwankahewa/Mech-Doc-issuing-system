module.exports = function base64DataURLToBuffer(dataURL) {
  const matches = dataURL.match(/^data:(.+);base64,(.+)$/);
  if (!matches) throw new Error("Invalid data URL");

  return Buffer.from(matches[2], "base64");
};
