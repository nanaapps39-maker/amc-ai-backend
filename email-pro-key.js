import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendProKeyEmail(email, key) {
  const msg = {
    to: email,
    from: process.env.EMAIL_USER, // support@amcacademy.tech
    subject: "Your AMC Academy Tech AI Pro Access Key",
    text: `
Hello,

Thank you for subscribing to AMC Academy Tech AI.

Your Pro Access Key is:

${key}

Enter this key inside AMC Academy Tech AI to unlock Pro Mode.

If you need help, reply to this email.

Regards,
AMC Academy Tech AI
    `,
  };

  try {
    await sgMail.send(msg);
    console.log("📧 Pro Key email sent to:", email);
  } catch (err) {
    console.error("❌ Failed to send Pro Key email:", err);
  }
}
