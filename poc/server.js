require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');

const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Middleware giả lập Authentication: Lấy User-Id từ Header
const authMiddleware = (req, res, next) => {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ message: 'Missing X-User-Id header' });
    req.userId = parseInt(userId);
    next();
};

// 1. QUESTION FILTERING: GET /api/questions?tags=1,2
app.get('/api/questions', async (req, res) => {
    try {
        const { tags } = req.query;
        let query = 'SELECT * FROM questions';
        let params = [];

        if (tags) {
            const tagIds = tags.split(',').map(Number);
            // Lọc câu hỏi CÓ TẤT CẢ các tag được truyền vào (Intersection)
            query = `
                SELECT q.* 
                FROM questions q
                JOIN question_tags qt ON q.id = qt.question_id
                WHERE qt.tag_id = ANY($1::int[])
                GROUP BY q.id
                HAVING COUNT(DISTINCT qt.tag_id) = $2
            `;
            params = [tagIds, tagIds.length];
        }

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. TẠO BOOKING (Pending)
app.post('/api/bookings', authMiddleware, async (req, res) => {
    const { slot_id } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO bookings (student_id, slot_id, status) VALUES ($1, $2, $3) RETURNING id',
            [req.userId, slot_id, 'Pending']
        );
        res.status(201).json({ booking_id: result.rows[0].id, status: 'Pending' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. MENTOR ACCEPT BOOKING (Double Booking, Transition, Outbox)
app.post('/api/bookings/:id/accept', authMiddleware, async (req, res) => {
    const bookingId = req.params.id;
    let client;
    try {
        client = await pool.connect();
        await client.query('BEGIN');

        // Khóa dòng Booking & Slot liên quan (Pessimistic Locking)
        const bRes = await client.query('SELECT * FROM bookings WHERE id = $1 FOR UPDATE', [bookingId]);
        if (bRes.rows.length === 0) throw new Error('Booking not found');
        const booking = bRes.rows[0];

        const sRes = await client.query('SELECT * FROM slots WHERE id = $1 FOR UPDATE', [booking.slot_id]);
        const slot = sRes.rows[0];

        // Validate state
        if (booking.status !== 'Pending') {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Chỉ có thể accept booking Pending' });
        }
        if (slot.status !== 'Available') {
            // Chặn Double Booking
            await client.query('ROLLBACK');
            return res.status(409).json({ message: 'Slot đã được đặt' });
        }

        // Cập nhật trạng thái
        await client.query('UPDATE bookings SET status = $1, meeting_link = $2 WHERE id = $3', ['Confirmed', 'https://meet.google.com/abc-xyz', bookingId]);
        await client.query('UPDATE slots SET status = $1 WHERE id = $2', ['Booked', booking.slot_id]);

        // Ghi Audit (Booking Transition)
        await client.query('INSERT INTO booking_audit (booking_id, from_status, to_status) VALUES ($1, $2, $3)', [bookingId, 'Pending', 'Confirmed']);

        // Ghi sự kiện Notification vào Outbox (Retry Pattern)
        await client.query('INSERT INTO notification_jobs (booking_id, status) VALUES ($1, $2)', [bookingId, 'pending']);

        await client.query('COMMIT');
        res.json({ message: 'Xác nhận thành công' });
    } catch (error) {
        if (client) await client.query('ROLLBACK');
        res.status(500).json({ error: error.message });
    } finally {
        if (client) client.release();
    }
});

// 4. GET MEETING LINK (Authorization Check)
app.get('/api/bookings/:id/meeting-link', authMiddleware, async (req, res) => {
    const bookingId = req.params.id;
    try {
        const result = await pool.query(`
            SELECT b.meeting_link, b.student_id, s.mentor_id 
            FROM bookings b 
            JOIN slots s ON b.slot_id = s.id 
            WHERE b.id = $1
        `, [bookingId]);

        if (result.rows.length === 0) return res.status(404).json({ message: 'Not found' });
        const row = result.rows[0];

        // Object-level Authorization: Chỉ Student gửi booking hoặc Mentor của slot đó mới được xem
        if (req.userId !== row.student_id && req.userId !== row.mentor_id) {
            return res.status(403).json({ message: 'Forbidden: Bạn không có quyền truy cập meeting link này' });
        }

        res.json({ meeting_link: row.meeting_link });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 5. HOÀN THÀNH BOOKING (Strict Transition)
app.post('/api/bookings/:id/complete', authMiddleware, async (req, res) => {
    const bookingId = req.params.id;
    let client;
    try {
        client = await pool.connect();
        await client.query('BEGIN');
        const bRes = await client.query('SELECT status FROM bookings WHERE id = $1 FOR UPDATE', [bookingId]);
        if (bRes.rows.length === 0) throw new Error('Not found');

        const currentStatus = bRes.rows[0].status;
        
        // Strict State Machine: Phải từ Confirmed -> Completed
        if (currentStatus !== 'Confirmed') {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: `State sai lệnh: Không thể chuyển từ ${currentStatus} sang Completed` });
        }

        await client.query('UPDATE bookings SET status = $1 WHERE id = $2', ['Completed', bookingId]);
        await client.query('INSERT INTO booking_audit (booking_id, from_status, to_status) VALUES ($1, $2, $3)', [bookingId, currentStatus, 'Completed']);
        
        await client.query('COMMIT');
        res.json({ message: 'Đã hoàn thành buổi phỏng vấn' });
    } catch (error) {
        if (client) await client.query('ROLLBACK');
        res.status(500).json({ error: error.message });
    } finally {
        if (client) client.release();
    }
});

// 6. GỬI FEEDBACK
app.post('/api/bookings/:id/feedback', authMiddleware, async (req, res) => {
    const bookingId = req.params.id;
    const { content } = req.body;
    try {
        const bRes = await pool.query('SELECT status FROM bookings WHERE id = $1', [bookingId]);
        if (bRes.rows.length === 0) return res.status(404).json({ message: 'Not found' });

        // Phải Confirmed hoặc Completed mới được feedback
        if (bRes.rows[0].status !== 'Completed' && bRes.rows[0].status !== 'Confirmed') {
            return res.status(400).json({ message: 'Chỉ được gửi feedback khi trạng thái là Confirmed hoặc Completed' });
        }

        await pool.query('INSERT INTO feedbacks (booking_id, content) VALUES ($1, $2)', [bookingId, content]);
        res.json({ message: 'Gửi feedback thành công' });
    } catch (error) {
        // Validation lỗi duplicate nếu cố ý submit 2 lần do CONSTRAINT UNIQUE DB
        if (error.code === '23505') {
            return res.status(409).json({ message: 'Feedback đã tồn tại cho booking này' });
        }
        res.status(500).json({ error: error.message });
    }
});

// 7. GET ALL MENTORS
app.get('/api/mentors', async (req, res) => {
    try {
        const result = await pool.query("SELECT id, name FROM users WHERE role = 'Mentor'");
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 8. GET SLOTS FOR A MENTOR
app.get('/api/mentors/:id/slots', async (req, res) => {
    const mentorId = req.params.id;
    try {
        const result = await pool.query(
            "SELECT id, start_time FROM slots WHERE mentor_id = $1 AND status = 'Available' ORDER BY start_time ASC",
            [mentorId]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 9. GET BOOKINGS FOR CURRENT USER
app.get('/api/bookings', authMiddleware, async (req, res) => {
    try {
        // Find current user role
        const userRes = await pool.query('SELECT role FROM users WHERE id = $1', [req.userId]);
        if (userRes.rows.length === 0) return res.status(404).json({ message: 'User not found' });
        
        const role = userRes.rows[0].role;
        let query = '';
        let params = [req.userId];

        if (role === 'Student') {
            query = `
                SELECT b.id, b.status, b.meeting_link, s.start_time, m.name as mentor_name 
                FROM bookings b 
                JOIN slots s ON b.slot_id = s.id 
                JOIN users m ON s.mentor_id = m.id 
                WHERE b.student_id = $1
                ORDER BY s.start_time DESC
            `;
        } else if (role === 'Mentor') {
            query = `
                SELECT b.id, b.status, b.meeting_link, s.start_time, st.name as student_name 
                FROM bookings b 
                JOIN slots s ON b.slot_id = s.id 
                JOIN users st ON b.student_id = st.id 
                WHERE s.mentor_id = $1
                ORDER BY s.start_time DESC
            `;
        }

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server API chạy tại http://localhost:${PORT}`);
});
