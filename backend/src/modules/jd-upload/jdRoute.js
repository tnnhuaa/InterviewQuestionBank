import { Router } from "express";
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
