require('dotenv').config();
const nodemailer = require('nodemailer');

const USER_EMAIL = process.env.EMAIL_USER;
const USER_PASS = process.env.EMAIL_PASS;
const RECEIVER_EMAIL = process.env.RECEIVER_EMAIL;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: USER_EMAIL,  
        pass: USER_PASS    
    }
});

function send(message) {
    return new Promise((resolve, reject) => {
        const mailOptions = {
            from: USER_EMAIL,           
            to: RECEIVER_EMAIL,                    
            subject: 'Test',
            text: message,
            html: '<p>' + message + '</p>'
        };

        transporter.sendMail(mailOptions, function(err, info) {
            if (err) {
                reject(err);
            } else {
                resolve(info);
            }
        });
    });
}

module.exports = { send };