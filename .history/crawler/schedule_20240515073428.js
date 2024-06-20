const cron = require('node-cron');
const fs = require('fs');
const csv = require('csv-parser');
const db = require('../_helpers/db'); // Đảm bảo db này bao gồm các model đã định nghĩa

// Lên lịch cho các nhiệm vụ được thực thi trên máy chủ.
cron.schedule('*/5 * * * * *', function () {
    console.log('running a task every 5 seconds');
    readFile();
});

function readFile() {
    fs.createReadStream("saved_from_db.csv") // Đổi tên file nếu là CSV
        .pipe(csv({
            separator: '|'
        }))
        .on('data', async (row) => {
            try {
                console.log({
                    fullname: row.name,  // Cập nhật khớp tên cột
                    workplace: row.position,
                    introduce: row.introduce
                });
                // Lấy dữ liệu cần thêm từ mỗi hàng của CSV
                const fullname = row.name;
                const workplace = row.position;
                const introduce = row.introduce;

                // Thực hiện cập nhật trong cơ sở dữ liệu
                await db.Doctor.create({
                    fullname: fullname,  // Đảm bảo tên cột khớp với model
                    workplace: workplace,
                    introduce: introduce
                });

                // Nếu có các bảng khác cần thêm dữ liệu
                // await db.Position.create({
                //     value: row.degree
                // });
                // await db.Specialization.create({
                //     description: row.specialist,
                // });

                console.log(`Dữ liệu từ hàng ${fullname} đã được thêm vào cơ sở dữ liệu.`);
            } catch (error) {
                console.error('Lỗi khi thêm dữ liệu vào cơ sở dữ liệu:', error);
            }
        })
        .on('end', () => {
            console.log('Dữ liệu đã được nhập vào cơ sở dữ liệu.');
        });
}