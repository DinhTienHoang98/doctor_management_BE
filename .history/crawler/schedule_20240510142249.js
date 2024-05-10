
const cron = require('node-cron');
const fs = require('fs');
const csv = require('csv-parser');
const db = require('_helpers/db');


// Lên lịch cho các nhiệm vụ được thực thi trên máy chủ.
cron.schedule('*/5 * * * * *', function () {
    console.log('running a task every 5 seconds');
    readFile()
});

function readFile() {
    fs.createReadStream("saved_from_db.csv") // Đổi tên file nếu là CSV
        .pipe(csv({
            separator: '|'
        }))
        .on('data', async (row) => {
            try {
                // Lấy dữ liệu cần thêm từ mỗi hàng của CSV
                const name = row.name;
                // Thực hiện cập nhật mật khẩu trong cơ sở dữ liệu
                const result = await db.Account.update(
                    { password: newPassword },
                    { where: { email: email } }
                );
                await results.Doctor.update({
                    fullName: name // Thay thế "fullName" bằng tên cột tương ứng trong cơ sở dữ liệu
                    // Thêm các trường dữ liệu khác nếu cần
                });
                console.log(`Dữ liệu từ hàng ${name} đã được thêm vào cơ sở dữ liệu.`);
            } catch (error) {
                console.error('Lỗi khi thêm dữ liệu vào cơ sở dữ liệu:', error);
            }
        })
        // .on('data', (row) => {

        //     console.log({
        //         name: row.name,
        //         degree: row.degree,
        //         specialist: row.specialist
        //     })
        // })
        .on('end', () => {
            console.log('Dữ liệu đã được nhập vào cơ sở dữ liệu.');
        });
}

