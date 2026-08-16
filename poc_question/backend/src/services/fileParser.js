const pdfParse = require('pdf-parse');

async function parsePDF(buffer) {
    try {
        const data = await pdfParse(buffer);
        return data.text;
    } catch (error) {
        console.error("Error parsing PDF:", error);
        throw new Error("Failed to parse PDF file.");
    }
}

module.exports = {
    parsePDF
};
