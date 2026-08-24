# Code Inspection Log

**Project:** Interview Practice Platform
**Method:** Direct review comments on GitHub Pull Requests

**Pull Request #25:** Added the Job Description (JD) upload and OCR feature
**Assignee:** Minh Trí
**Reviewer:** Tuấn Anh

## Issues found during review

**1. Security / File handling issue (File: `jdController.js` — line 42)**
- *Tuấn Anh (Reviewer):* This path receives an uploaded file from the user but does not validate the MIME type. If a user uploads an `.exe` or a malicious script instead of a PDF/image, the OCR will fail. Add a validation function before saving the file.
- *Minh Trí (Assignee):* Noted. I will add a `multer` middleware filter for `.pdf, .png, .jpg` files.
![alt text](img/image.png)

**2. Performance issue (File: `ocrService.js` — line 80)**
- *Tuấn Anh (Reviewer):* This code calls a third-party API (Google Vision) outside a `try...catch` block. If the third-party API times out, Node.js will crash the whole application.
- *Minh Trí (Assignee):* You're right, I missed that. I have added the `try...catch` and return an error code 500 to the frontend. (Fix committed: `fix: add error handling for OCR API`).
![alt text](img/image-1.png)

**=> Conclusion:** The Pull Request received **Request Changes** on the first pass. After the assignee fixed both issues above, the reviewer pressed **Approve** and merged the code into the main branch.
![alt text](img/image-2.png)
