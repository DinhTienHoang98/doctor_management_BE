
const cron = require('node-cron');
const fs = require('fs');
const csv = require('csv-parser');

// Lên lịch cho các nhiệm vụ được thực thi trên máy chủ.
cron.schedule('*/5 * * * * *', function () {
    console.log('running a task every 5 seconds');
    readFile();
});

function readFile() {
    fs.createReadStream("crawler/saved_from_db.csv") // Đổi tên file nếu là CSV
        .pipe(csv())
        .on('data', (row) => {
            console.log(row)
        })
        .on('end', () => {
            console.log('Dữ liệu đã được nhập vào cơ sở dữ liệu.');
        });
}
// Schedule tasks to be run on the server.
cron.schedule('*/5 * * * * *', function () {
    console.log('running a task every minute');
    readFile();
});

function readFile() {
    fs.createReadStream("saved_from_db.js")
        .pipe(csv())
        .on('data', (row) => {
            console.log(row)
        })
        .on('end', () => {
            console.log('Dữ liệu đã được nhập vào cơ sở dữ liệu.');
        });
}