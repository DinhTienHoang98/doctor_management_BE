
const cron = require('node-cron');

// Schedule tasks to be run on the server.
cron.schedule('* * * * * *', function () {
    console.log('running a task every minute');
});

function readFile() {
    fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', async (row) => {
            // Lưu mỗi hàng của CSV vào cơ sở dữ liệu
            console.lo
        })
        .on('end', () => {
            console.log('Dữ liệu đã được nhập vào cơ sở dữ liệu.');
        });
}