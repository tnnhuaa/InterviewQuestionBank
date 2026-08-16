const { parsePDF } = require('../services/fileParser');
const { extractJDTopics } = require('../services/aiExtractor');
const db = require('../config/db');

async function uploadJD(req, res) {
    console.log(`\n--- [START] API /upload-jd CALL ---`);
    console.log(`[LOG] Nhận request upload file...`);
    try {
        if (!req.file) {
            console.log(`[ERROR] Không có file nào được gửi lên.`);
            return res.status(400).json({ error: "No file uploaded" });
        }

        console.log(`[LOG] Định dạng file nhận được: ${req.file.mimetype}, Kích thước: ${req.file.size} bytes`);
        
        let jdText = "";
        if (req.file.mimetype === 'application/pdf') {
            console.log(`[LOG] Đang trích xuất văn bản từ PDF...`);
            jdText = await parsePDF(req.file.buffer);
            jdText = jdText.replace(/\0/g, '');
            console.log(`[LOG] Độ dài văn bản sau khi lọc: ${jdText.length} ký tự.`);
            if (jdText.trim() === "") {
                return res.status(400).json({ error: "Không thể trích xuất chữ từ file PDF này." });
            }
        } else if (req.file.mimetype.startsWith('image/')) {
            console.log(`[LOG] Phát hiện file ảnh. Đang chuyển đổi sang Base64 InlineData...`);
            // Chuyển ảnh sang dạng base64 object để đưa cho Gemini
            jdText = {
                mimeType: req.file.mimetype,
                data: req.file.buffer.toString('base64')
            };
            console.log(`[LOG] Chuyển đổi thành công. Dữ liệu Base64 đã sẵn sàng.`);
        } else {
            console.log(`[LOG] Xử lý file văn bản thông thường (TXT/DOCX)...`);
            jdText = req.file.buffer.toString('utf-8');
            jdText = jdText.replace(/\0/g, '');
            console.log(`[LOG] Độ dài văn bản sau khi lọc: ${jdText.length} ký tự.`);
            if (jdText.trim() === "") {
                return res.status(400).json({ error: "File không chứa văn bản hợp lệ." });
            }
        }

        console.log(`[LOG] Bắt đầu gọi service AI Extract...`);
        // 1. Extract Topics with AI
        const extraction = await extractJDTopics(jdText);
        console.log(`[LOG] AI Extract hoàn tất. Tìm thấy chức danh: "${extraction.job_title}" và ${extraction.topics ? extraction.topics.length : 0} topics.`);

        // 2. Create Session
        console.log(`[LOG] Đang lưu phiên làm việc (Session) mới vào Database...`);
        const sessionResult = await db.query(
            `INSERT INTO sessions (job_title, raw_jd) VALUES ($1, $2) RETURNING id`,
            [extraction.job_title, typeof jdText === 'string' ? jdText : "[IMAGE_DATA]"]
        );
        const sessionId = sessionResult.rows[0].id;
        console.log(`[LOG] Lưu Session thành công với ID = ${sessionId}`);

        // 3. Process Topics and Mapping
        const finalTopics = [];

        console.log(`[LOG] Bắt đầu quá trình Mapping vào Question Bank...`);
        for (let i = 0; i < extraction.topics.length; i++) {
            const topic = extraction.topics[i];
            console.log(`[LOG]  -> Xử lý Topic: "${topic.name}" (Keywords: ${topic.keywords ? topic.keywords.join(', ') : 'none'})`);
            
            // Insert Topic
            const topicResult = await db.query(
                `INSERT INTO session_topics (session_id, name, description, order_index) VALUES ($1, $2, $3, $4) RETURNING *`,
                [sessionId, topic.name, topic.description, i]
            );
            const savedTopic = topicResult.rows[0];
            
            // Map questions from DB using tags/topic name
            const keywords = topic.keywords || [];
            let matchedQuestions = { rows: [] };

            // 1. Thử match theo tên Topic (2 chiều)
            matchedQuestions = await db.query(`
                SELECT * FROM question_bank 
                WHERE topic ILIKE $1 
                   OR sub_topic ILIKE $1 
                   OR $2 ILIKE '%' || topic || '%'
                LIMIT 3
            `, [`%${topic.name}%`, topic.name]);

            // 2. Nếu không có kết quả, thử match theo Keywords do AI trích ra
            if (matchedQuestions.rows.length === 0 && keywords.length > 0) {
                // Lấy 3 keyword đầu tiên để tránh query quá dài
                const topKeywords = keywords.slice(0, 3);
                const conditions = topKeywords.map((_, idx) => `tags::text ILIKE $${idx + 1} OR topic ILIKE $${idx + 1}`).join(' OR ');
                const values = topKeywords.map(kw => `%${kw}%`);
                
                matchedQuestions = await db.query(`
                    SELECT * FROM question_bank 
                    WHERE ${conditions}
                    LIMIT 3
                `, values);
            }

            console.log(`[LOG]    Tìm thấy ${matchedQuestions.rows.length} câu hỏi phù hợp trong DB cho Topic "${topic.name}".`);

            const questionsToSave = [];
            
            if (matchedQuestions.rows.length > 0) {
                for (let j = 0; j < matchedQuestions.rows.length; j++) {
                    const q = matchedQuestions.rows[j];
                    const qResult = await db.query(`
                        INSERT INTO session_questions (session_topic_id, question_text, sample_answer, difficulty, source, original_bank_id, order_index)
                        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
                    `, [savedTopic.id, q.question_text, q.sample_answer, q.difficulty, 'Question_Bank', q.id, j]);
                    questionsToSave.push(qResult.rows[0]);
                }
            }
            // Không sử dụng AI để tự sinh câu hỏi nữa, nếu topic không map được với DB, topic đó sẽ có 0 câu hỏi
            // Người dùng có thể click "Thêm từ Ngân hàng" để tự bổ sung sau.

            finalTopics.push({
                ...savedTopic,
                questions: questionsToSave
            });
        }

        console.log(`[LOG] Gửi phản hồi thành công về Frontend. Dữ liệu Session hoàn tất.`);
        console.log(`--- [END] API /upload-jd CALL ---\n`);

        res.status(200).json({
            sessionId,
            job_title: extraction.job_title,
            topics: finalTopics
        });
    } catch (error) {
        console.error(`[ERROR] Quá trình phân tích JD gặp lỗi nghiêm trọng:`, error);
        console.log(`--- [END] API /upload-jd CALL WITH ERROR ---\n`);
        res.status(500).json({ error: "Failed to process JD" });
    }
}

async function getSession(req, res) {
    const { id } = req.params;
    try {
        const sessionRes = await db.query(`SELECT * FROM sessions WHERE id = $1`, [id]);
        if (sessionRes.rows.length === 0) return res.status(404).json({ error: "Not found" });
        
        const session = sessionRes.rows[0];
        
        const topicsRes = await db.query(`SELECT * FROM session_topics WHERE session_id = $1 ORDER BY order_index ASC`, [id]);
        const topics = topicsRes.rows;

        for (let i = 0; i < topics.length; i++) {
            const qRes = await db.query(`SELECT * FROM session_questions WHERE session_topic_id = $1 ORDER BY order_index ASC`, [topics[i].id]);
            topics[i].questions = qRes.rows;
        }
        
        session.topics = topics;
        res.json(session);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function getQuestionBank(req, res) {
    try {
        const qRes = await db.query(`SELECT * FROM question_bank ORDER BY topic, difficulty`);
        res.json(qRes.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function addQuestionToTopic(req, res) {
    const { topicId } = req.params;
    const { question_text, sample_answer, difficulty, source, original_bank_id } = req.body;
    try {
        const qResult = await db.query(`
            INSERT INTO session_questions (session_topic_id, question_text, sample_answer, difficulty, source, original_bank_id)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
        `, [topicId, question_text, sample_answer, difficulty, source || 'User_Added', original_bank_id || null]);
        res.json(qResult.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function updateQuestion(req, res) {
    const { questionId } = req.params;
    const { question_text, sample_answer, difficulty } = req.body;
    try {
        const qResult = await db.query(`
            UPDATE session_questions 
            SET question_text = $1, sample_answer = $2, difficulty = $3
            WHERE id = $4 RETURNING *
        `, [question_text, sample_answer, difficulty, questionId]);
        res.json(qResult.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function deleteQuestion(req, res) {
    const { questionId } = req.params;
    try {
        await db.query(`DELETE FROM session_questions WHERE id = $1`, [questionId]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    uploadJD,
    getSession,
    getQuestionBank,
    addQuestionToTopic,
    updateQuestion,
    deleteQuestion
};
