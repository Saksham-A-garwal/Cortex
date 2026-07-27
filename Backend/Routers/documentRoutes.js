const express = require("express");
const multer = require("multer");
const { isAuthenticated } = require("../middleware/authmiddleware");
const {
  handleUploadDocument,
  handleGetDocuments,
  handleDeleteDocument,
} = require("../Controllers/documentControllers");

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    const allowedTypes = ["application/pdf", "text/plain"];
    if (allowedTypes.includes(file.mimetype)) return callback(null, true);
    return callback(new Error("Only PDF and TXT files are supported."));
  },
});

router.use(isAuthenticated);
router.get("/", handleGetDocuments);
router.post("/upload", upload.single("file"), handleUploadDocument);
router.delete("/:id", handleDeleteDocument);

router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({ msg: "Document upload failed: file must be 10 MB or smaller." });
  }
  if (error) return res.status(400).json({ msg: error.message || "Document upload failed." });
  return next();
});

module.exports = router;
