const cron = require('node-cron');
const fs = require('fs');
const csv = require('csv-parser');
const db = require('../_helpers/db'); // Đảm bảo db này bao gồm các model đã định nghĩa

// Lên lịch cho các nhiệm vụ được thực thi trên máy chủ.
cron.schedule('*/5 * * * * *', function () {
    console.log('running a task every 5 seconds');
    readFile();
});

async function generateSpecializationCode() {
    const lastSpecialization = await db.Specialization.findOne({
        order: [['code', 'DESC']]
    });

    let newCode = 'CK01';
    if (lastSpecialization && lastSpecialization.code) {
        const lastCode = lastSpecialization.code;
        const numericPart = parseInt(lastCode.slice(2)) + 1;
        newCode = 'CK' + String(numericPart).padStart(2, '0');
    }
    return newCode;
}


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
                    fullname: rơfullname,  // Đảm bảo tên cột khớp với model
                    workplace: row.position,
                    introduce: row.introduce
                });

                await db.Position.create({
                    value: row.degree
                });

                // // Tạo mới Specialization với code tự động
                const code = await generateSpecializationCode();
                await db.Specialization.create({
                    code: code,
                    description: row.specialist
                });

                console.log(`Dữ liệu từ hàng ${fullname} đã được thêm vào cơ sở dữ liệu.`);
            } catch (error) {
                console.error('Lỗi khi thêm dữ liệu vào cơ sở dữ liệu:', error);
            }
        })
        .on('end', () => {
            console.log('Dữ liệu đã được nhập vào cơ sở dữ liệu.');
        });
}
