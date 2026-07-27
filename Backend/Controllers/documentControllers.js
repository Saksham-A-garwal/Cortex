const Document = require("../Model/DocumentModel");
const { extractText } = require("../Services/documentService");
const {
  indexDocument,
  deleteDocumentVectors,
} = require("../Services/qdrantService");

const handleUploadDocument = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ msg: "Upload a PDF or TXT file." });
  }

  try {
    const text = await extractText(req.file);
    if (!text.trim()) {
      return res.status(400).json({
        msg: "No readable text was found in this document.",
      });
    }

    const document = await Document.create({
      owner: req.user._id,
      filename: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      chunkCount: 0,
    });

    try {
      const chunkCount = await indexDocument({
        text,
        ownerId: req.user._id.toString(),
        documentId: document._id.toString(),
        filename: document.filename,
      });

      document.chunkCount = chunkCount;
      await document.save();
      return res.status(201).json({
        msg: "Document uploaded and indexed successfully.",
        document,
      });
    } catch (error) {
      await Document.findByIdAndDelete(document._id);
      throw error;
    }
  } catch (error) {
    console.error("Document upload failed:", error);
    return res.status(500).json({ msg: error.message || "Could not index this document." });
  }
};

const handleGetDocuments = async (req, res) => {
  const documents = await Document.find({ owner: req.user._id })
    .sort({ createdAt: -1 })
    .select("filename mimeType size chunkCount createdAt");
  return res.status(200).json({ documents });
};

const handleDeleteDocument = async (req, res) => {
  const document = await Document.findOne({
    _id: req.params.id,
    owner: req.user._id,
  });

  if (!document) {
    return res.status(404).json({ msg: "Document not found." });
  }

  try {
    await deleteDocumentVectors(req.user._id.toString(), document._id.toString());
    await Document.deleteOne({ _id: document._id });
    return res.status(200).json({ msg: "Document deleted successfully." });
  } catch (error) {
    console.error("Document deletion failed:", error);
    return res.status(500).json({ msg: "Could not delete this document." });
  }
};

module.exports = { handleUploadDocument, handleGetDocuments, handleDeleteDocument };
