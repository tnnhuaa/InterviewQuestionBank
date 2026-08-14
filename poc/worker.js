require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

console.log("Background Worker khởi động: Đang theo dõi bảng notification_jobs...");

async function processOutbox() {
    try {
        // Lấy 5 jobs đang pending hoặc failed (chưa tới giới hạn retry)
        const result = await pool.query(`
            SELECT * FROM notification_jobs 
            WHERE status IN ('pending', 'failed') AND retry_count < 3
            ORDER BY created_at ASC
            LIMIT 5
        `);

        for (let job of result.rows) {
            console.log(`[Worker] Đang xử lý Job ID ${job.id} (Booking: ${job.booking_id}), Lần thử: ${job.retry_count + 1}`);

            // Giả lập tỉ lệ gửi mail lỗi 50%
            const isSuccess = Math.random() > 0.5;

            if (isSuccess) {
                // Thành công -> Đổi status thành sent
                await pool.query('UPDATE notification_jobs SET status = $1 WHERE id = $2', ['sent', job.id]);
                console.log(`  => ✅ Gửi email thành công!`);
            } else {
                // Thất bại -> Tăng retry_count, đổi status thành failed
                await pool.query('UPDATE notification_jobs SET status = $1, retry_count = retry_count + 1 WHERE id = $2', ['failed', job.id]);
                console.log(`  => ❌ Gửi email thất bại (Lỗi giả lập mạng). Sẽ retry lần sau.`);
            }
        }
    } catch (error) {
        console.error("[Worker Error]", error);
    }
}

// Chạy vòng lặp mỗi 3 giây
setInterval(processOutbox, 3000);
