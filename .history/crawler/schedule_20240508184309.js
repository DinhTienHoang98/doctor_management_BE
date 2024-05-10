
const cron = require('node-cron');

// Schedule tasks to be run on the server.
cron.schedule('*/5 * * * * *', function () {
    console.log('running a task every minute');
    readFile();
});

function readFile() {
    fs.createReadStream("saved_from_db.js")
        .pipe(csv())
        .on('data', async (row) => {
            // Lưu mỗi hàng của CSV vào cơ sở dữ liệu
            console.log(row)
        })
        .on('end', () => {
            console.log('Dữ liệu đã được nhập vào cơ sở dữ liệu.');
        });
}