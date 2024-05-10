const nodemailer = require('nodemailer');

// or for ES Modules:
import nodemailer from ‘nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'hoangqsqt98@gmail.com',
        pass: 'Nopass98=]'
    }
});

const mailOptions = {
    from: 'hoangqsqt98@gmail.com',
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