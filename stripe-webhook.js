const sendEmail = require('./send-email');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const bodyParser = require('body-parser');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

module.exports = function stripeWebhook(app) {
    app.post('/api/stripe/pro-key-webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
        const sig = req.headers['stripe-signature'];

        let event;
        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                process.env.STRIPE_WEBHOOK_SECRET
            );
        } catch (err) {
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        // ===============================
        // ⭐ Load keys from environment
        // ===============================
        const loadKeys = () => {
            try {
                return JSON.parse(process.env.PRO_KEYS_JSON || "[]");
            } catch (err) {
                console.error("❌ Failed to parse PRO_KEYS_JSON:", err);
                return [];
            }
        };

        // ===============================
        // ⭐ Save updated keys to local file (temporary sync)
        // ===============================
        const saveKeys = (keys) => {
            const filePath = path.join(__dirname, "pro-keys.json");
            fs.writeFileSync(filePath, JSON.stringify(keys, null, 2));
            console.log("⚠️ PRO_KEYS_JSON updated locally — remember to sync to Render.");
        };

        switch (event.type) {

            // ===============================
            // Checkout Completed → Generate Key
            // ===============================
            case 'checkout.session.completed': {
                const session = event.data.object;

                const email =
                    session.customer_details?.email ||
                    session.customer_email ||
                    session.customer?.email ||
                    null;

                if (!email) {
                    console.log("⚠️ No email found in checkout.session.completed");
                    break;
                }

                // Generate Pro Access Key
                const key = `AMC-PRO-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

                // Determine expiry (monthly or annual)
                let expiryDays = 30;

                const priceId =
                    session.metadata?.price_id ||
                    session.display_items?.[0]?.price?.id ||
                    session.line_items?.[0]?.price?.id ||
                    null;

                if (priceId === process.env.STRIPE_ANNUAL_PRICE_ID) {
                    expiryDays = 365;
                }

                const keys = loadKeys();
                keys.push({
                    email,
                    key,
                    created_at: new Date().toISOString(),
                    active: true,
                    expiry_at: new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000).toISOString()
                });

                saveKeys(keys);

                console.log(`✅ Generated Pro Key for ${email}: ${key} (Expiry: ${expiryDays} days)`);

                // Email delivery
                try {
                    await sendEmail({
                        to: email,
                        subject: "Your AMC Academy Tech AI Pro Access Key",
                        html: `
                            <div style="font-family: Arial, sans-serif; padding: 20px;">
                                <h2 style="color:#0057ff;">AMC Academy Tech AI — Pro Access Activated</h2>
                                <p>Dear Customer,</p>
                                <p>Thank you for subscribing to <strong>AMC Academy Tech AI Pro</strong>.</p>
                                <p>Your Pro Access Key is:</p>
                                <h3 style="color:#0057ff; font-size: 24px;">${key}</h3>
                                <p>This key is valid for <strong>${expiryDays} days</strong> and will auto-renew with your subscription.</p>
                                <p>Enter this key inside AMC Academy Tech AI to unlock all Pro features.</p>
                                <br>
                                <p>Regards,<br><strong>AMC Academy Tech Support</strong><br>support@amcacademy.tech</p>
                            </div>
                        `
                    });

                    console.log(`📧 Pro Key emailed to ${email}`);
                } catch (err) {
                    console.error("❌ Email sending failed:", err);
                }

                break;
            }

            // ===============================
            // Subscription Renewal Paid
            // ===============================
            case 'invoice.paid': {
                const invoice = event.data.object;
                const email = invoice.customer_email;

                if (!email) break;

                const keys = loadKeys();
                const user = keys.find(k => k.email === email);

                if (user) {
                    user.active = true;

                    let renewalDays = 30;
                    const priceId = invoice.lines.data[0].price.id;

                    if (priceId === process.env.STRIPE_ANNUAL_PRICE_ID) {
                        renewalDays = 365;
                    }

                    user.expiry_at = new Date(Date.now() + renewalDays * 24 * 60 * 60 * 1000).toISOString();

                    saveKeys(keys);
                    console.log(`🔄 Subscription renewed for ${email} — expiry extended by ${renewalDays} days`);
                }
                break;
            }

            // ===============================
            // Subscription Renewal Failed
            // ===============================
            case 'invoice.payment_failed': {
                const invoice = event.data.object;
                const email = invoice.customer_email;

                if (!email) break;

                const keys = loadKeys();
                const user = keys.find(k => k.email === email);

                if (user) {
                    user.active = false;
                    saveKeys(keys);
                    console.log(`⚠️ Subscription payment failed for ${email} — key deactivated`);
                }
                break;
            }

            // ===============================
            // Subscription Cancelled
            // ===============================
            case 'customer.subscription.deleted': {
                const subscription = event.data.object;

                const customer = await stripe.customers.retrieve(subscription.customer);
                const email = customer.email;

                if (!email) break;

                const keys = loadKeys();
                const user = keys.find(k => k.email === email);

                if (user) {
                    user.active = false;
                    saveKeys(keys);
                    console.log(`❌ Subscription cancelled for ${email} — key deactivated`);
                }
                break;
            }
        }

        res.json({ received: true });
    });
};

