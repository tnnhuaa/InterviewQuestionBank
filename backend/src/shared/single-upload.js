import multer from "multer";

export function singleUpload(fieldName, { fileSize }) {
  const parse = multer({
    storage: multer.memoryStorage(),
    limits: { files: 1, fileSize },
  }).single(fieldName);

  return function singleUploadMiddleware(request, response, next) {
    if (Array.isArray(request.files)) {
      request.file = request.files.find((file) => file.fieldname === fieldName);
      return next();
    }
    return parse(request, response, next);
  };
}
