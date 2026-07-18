const nodemailer = require('nodemailer');

module.exports = async function sendEmail({ to, subject, html }) {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    await transporter.sendMail({
        from: "AMC Academy Tech Support <support@amcacademy.tech>",
        to,
        subject,
        html
    });

    console.log(`📨 Email sent to ${to}`);
};
