// send-email.js
const sgMail = require('@sendgrid/mail');

// Load SendGrid API key from environment variables
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Sends the Pro Access Key to the learner's email.
 *
 * @param {string} to - The learner's email address
 * @param {string} key - The generated Pro Access Key
 */
async function sendEmail(to, key) {
    const msg = {
        to,
        from: 'support@amcacademy.tech', // Your verified sender email
        subject: 'Your AMC Academy Tech Pro Access Key',
        text: `
Hello,

Thank you for subscribing to AMC Academy Tech AI.

Your Pro Access Key is:

${key}

Enter this key in the AMC AI bubble to unlock Pro Mode.

Regards,
AMC Academy Tech
        `,
    };

    try {
        await sgMail.send(msg);
        console.log(`📧 Email sent to ${to} with Pro Key: ${key}`);
    } catch (error) {
        console.error('❌ Email sending failed:', error);
    }
}

module.exports = sendEmail;
