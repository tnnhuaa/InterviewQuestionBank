import { Router } from "express";
import path from "path"; // Lỗi 3: Import thư viện path dư thừa không dùng tới (như log dòng 12)
import { upload, uploadJd } from "./jdController.js";
import { requireRole } from "../../middleware/auth.js";

export const jdRoute = Router();

// Endpoint upload JD mới với các lỗi đã được cài
jdRoute.post(
  "/job-descriptions/upload-ocr",
  requireRole("STUDENT"),
  upload.single("file"),
  uploadJd
);
