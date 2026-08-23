import multer from "multer";
import { extractTextFromImage } from "./ocrService.js";

export const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Định dạng file không được hỗ trợ. Chỉ cho phép PDF, PNG, JPG."), false);
    }
  }
});

export const uploadJd = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Không tìm thấy file tải lên." });
  }

  try {
    const extractedText = await extractTextFromImage(req.file.buffer);

    return res.status(200).json({
      success: true,
      message: "Trích xuất văn bản thành công",
      data: {
        text: extractedText,
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Lỗi xử lý OCR" });
  }
};
