const express = require('express');
const multer = require('multer');
const router = express.Router();
const jdController = require('../controllers/jdController');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload-jd', upload.single('jdFile'), jdController.uploadJD);
router.get('/sessions/:id', jdController.getSession);
router.get('/question-bank', jdController.getQuestionBank);

// Session questions management
router.post('/topics/:topicId/questions', jdController.addQuestionToTopic);
router.put('/questions/:questionId', jdController.updateQuestion);
router.delete('/questions/:questionId', jdController.deleteQuestion);

module.exports = router;
