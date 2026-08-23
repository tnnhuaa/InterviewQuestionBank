import Tesseract from "tesseract.js";

export async function extractTextFromImage(fileBuffer) {
  const result = await Tesseract.recognize(fileBuffer, "eng+vie", {
    logger: (m) => console.log(m),
  });
  return result.data.text;
}
