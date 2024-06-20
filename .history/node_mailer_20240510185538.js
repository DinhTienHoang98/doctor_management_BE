const nodemailer = require('nodemailer');

function sendEmail() {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'hoangqsqt98@gmail.com',
            pass: 'xtxb srlc xiyv oxsi'
        }
    });
    
    const mailOptions = {
        from: 'noname',
        to: 'hoangqsqt98@gmail.com',
        subject: 'Subject',
        text: 'Email content'
    };
    
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
            // do something useful
        }
    });
}

e