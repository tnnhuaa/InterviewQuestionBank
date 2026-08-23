import multer from "multer";
import { extractTextFromImage } from "./ocrService.js";

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // Chỉ giới hạn dung lượng, không giới hạn loại file
});

export const uploadJd = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Không tìm thấy file tải lên." });
  }

  // Gọi service OCR (bên trong service không có try..catch)
  const extractedText = await extractTextFromImage(req.file.buffer);

  return res.status(200).json({
    success: true,
    message: "Trích xuất văn bản thành công",
    data: {
      text: extractedText,
    }
  });
};
