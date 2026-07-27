const { PDFParse } = require("pdf-parse");

const extractText = async (file) => {
  if (file.mimetype === "text/plain") {
    return file.buffer.toString("utf8");
  }

  const parser = new PDFParse({ data: file.buffer });
  try {
    const result = await parser.getText();
    return result.text;
  } finally {
    await parser.destroy();
  }
};

module.exports = { extractText };
