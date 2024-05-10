
const cron = require('node-cron');
const fs = require('fs');
const csv = require('csv-parser');

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
        .on('data', (row) => {
            console.log({
                name: 'Bác sĩ Tôn Thất Trí Dũng',
                degree: 'Tiến sĩ, Bác sĩ',
                specialist: 'Nội Thần kinh',
                position: 'Khoa Khám bệnh & Nội khoa - Bệnh viện Đa khoa Quốc tế Vinmec Đà Nẵng',
                introduce: 'Tiến sĩ. Bác sĩ Tôn Thất Trí Dũng đã có trên 20 năm kinh nghiệm trong chuyên ngành thần kinh. Bác sĩ Dũng nhận học vị tiến sĩ tại Đại học Y dược Huế và... Xem thêm'
              })
        })
        .on('end', () => {
            console.log('Dữ liệu đã được nhập vào cơ sở dữ liệu.');
        });
}