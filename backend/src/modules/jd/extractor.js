import { createCanvas } from "@napi-rs/canvas";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { createWorker } from "tesseract.js";

const MIN_DIRECT_TEXT_CHARACTERS = 50;

async function withTimeout(operation, timeoutMs) {
  let timeoutId;
  const timeout = new Promise((resolve, reject) => {
    timeoutId = setTimeout(() => reject(new Error("OCR_TIMEOUT")), timeoutMs);
  });
  try {
    return await Promise.race([operation, timeout]);
  } finally {
    clearTimeout(timeoutId);
  }
}

async function createOcrSession(languages, timeoutMs) {
  const worker = await createWorker(languages);
  return {
    async recognize(image) {
      return withTimeout(worker.recognize(image), timeoutMs);
    },
    async close() {
      await worker.terminate();
    },
  };
}

async function readPdf(buffer) {
  const document = await getDocument({ data: new Uint8Array(buffer), isEvalSupported: false }).promise;
  if (document.numPages > 5) throw new Error("PDF_PAGE_LIMIT");
  const pages = [];
  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const content = await page.getTextContent();
    pages.push(content.items.map((item) => item.str).join(" ").trim());
  }
  return { document, text: pages.join("\n\n").trim() };
}

async function renderPdfPage(document, pageNumber) {
  const page = await document.getPage(pageNumber);
  const viewport = page.getViewport({ scale: 2 });
  const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
  const context = canvas.getContext("2d");
  await page.render({ canvasContext: context, viewport }).promise;
  return canvas.toBuffer("image/png");
}

export async function extractDocument({ buffer, mimeType, ocr }) {
  const timeoutMs = ocr.timeoutSeconds * 1000;
  if (mimeType === "application/pdf") {
    const pdf = await readPdf(buffer);
    if (pdf.text.length >= MIN_DIRECT_TEXT_CHARACTERS) {
      return { text: pdf.text, method: "DIRECT_PDF", confidence: 1 };
    }
    const session = await createOcrSession(ocr.languages, timeoutMs);
    try {
      const pages = [];
      const confidences = [];
      for (let pageNumber = 1; pageNumber <= pdf.document.numPages; pageNumber += 1) {
        const result = await session.recognize(await renderPdfPage(pdf.document, pageNumber));
        pages.push(result.data.text.trim());
        confidences.push(result.data.confidence / 100);
      }
      return {
        text: pages.join("\n\n").trim(),
        method: "OCR",
        confidence: confidences.reduce((sum, value) => sum + value, 0) / confidences.length,
      };
    } finally {
      await session.close();
    }
  }
  const session = await createOcrSession(ocr.languages, timeoutMs);
  try {
    const result = await session.recognize(buffer);
    return { text: result.data.text.trim(), method: "OCR", confidence: result.data.confidence / 100 };
  } finally {
    await session.close();
  }
}
