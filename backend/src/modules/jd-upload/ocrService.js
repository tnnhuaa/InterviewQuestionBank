import Tesseract from "tesseract.js";

// Lỗi 2: Không dùng try...catch khi gọi API/Thư viện thứ 3 (như log dòng 80)
export async function extractTextFromImage(fileBuffer) {
  // Nếu Tesseract gặp lỗi (ví dụ truyền vào file .exe không phải ảnh), nó sẽ quăng lỗi
  // mà không có try..catch => Unhandled Promise Rejection => Có thể crash app.
  const result = await Tesseract.recognize(fileBuffer, "eng+vie", {
    logger: (m) => console.log(m),
  });
  return result.data.text;
}
