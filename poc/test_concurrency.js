const axios = require('axios');

const API_URL = 'http://localhost:3000/api/bookings/accept';
const CONCURRENT_REQUESTS = 100;
const TARGET_SLOT_ID = 1;

async function runTest() {
    console.log(`Bắt đầu giả lập nã ${CONCURRENT_REQUESTS} request song song vào slot_id = ${TARGET_SLOT_ID}...`);
    
    // Tạo mảng chứa 100 promises (requests)
    const requests = [];
    for (let i = 1; i <= CONCURRENT_REQUESTS; i++) {
        // Payload giả lập 100 sinh viên khác nhau cùng book 1 slot
        const payload = {
            slot_id: TARGET_SLOT_ID,
            student_id: i // Dùng index làm ID sinh viên luôn
        };
        
        // Không dùng await ở đây để các request chạy đồng thời
        requests.push(axios.post(API_URL, payload).catch(err => err.response));
    }

    // Đợi TẤT CẢ 100 requests phản hồi xong
    const responses = await Promise.all(requests);

    // Thống kê kết quả
    let successCount = 0;
    let conflictCount = 0;
    let errorCount = 0;

    responses.forEach(res => {
        if (res && res.status === 200) {
            successCount++;
        } else if (res && res.status === 409) {
            conflictCount++;
        } else {
            errorCount++;
        }
    });

    console.log('\n--- KẾT QUẢ TEST ---');
    console.log(`- Số request THÀNH CÔNG (Kỳ vọng: 1)     : ${successCount}`);
    console.log(`- Số request TỪ CHỐI do Conflict (Kỳ vọng: 99) : ${conflictCount}`);
    console.log(`- Lỗi khác                               : ${errorCount}`);
    
    if (successCount === 1) {
        console.log('\n=> POC THÀNH CÔNG! Hệ thống đã ngăn chặn được Double-Booking.');
    } else {
        console.log('\n=> POC THẤT BẠI! Database bị lỗi Double-Booking.');
    }
}

runTest();
