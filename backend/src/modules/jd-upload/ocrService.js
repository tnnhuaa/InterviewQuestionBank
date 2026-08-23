import Tesseract from "tesseract.js";

export async function extractTextFromImage(fileBuffer) {
  try {
    const result = await Tesseract.recognize(fileBuffer, "eng+vie", {
      logger: (m) => console.log(m),
    });
    return result.data.text;
  } catch (error) {
    console.error("Lỗi gọi API OCR:", error);
    throw new Error("Không thể trích xuất văn bản. Có lỗi xảy ra với thư viện thứ 3.");
  }
}
