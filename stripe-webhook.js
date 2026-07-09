const sendEmail = require('./send-email');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const bodyParser = require('body-parser');
const fs = require('fs');
const crypto = require('crypto');

module.exports = function stripeWebhook(app) {
    app.post('/stripe-webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
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
        // ⭐ File existence protection
        // ===============================
        const KEY_FILE = './pro-keys.json';

        if (!fs.existsSync(KEY_FILE)) {
            fs.writeFileSync(KEY_FILE, JSON.stringify([]));
        }

        // Helper: load key store
        const loadKeys = () =>
            JSON.parse(fs.readFileSync(KEY_FILE, 'utf8'));

        const saveKeys = (keys) =>
            fs.writeFileSync(KEY_FILE, JSON.stringify(keys, null, 2));

        switch (event.type) {

            // ===============================
            // Subscription Created / Checkout Completed
            // ===============================
            case 'checkout.session.completed': {
                const session = event.data.object;

                // Robust email extraction for Managed Payments
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

                const keys = loadKeys();
                keys.push({
                    email,
                    key,
                    created_at: new Date().toISOString(),
                    active: true
                });
                saveKeys(keys);

                console.log(`✅ Generated Pro Key for ${email}: ${key}`);

                // ⭐ Send the Pro Key by email
                sendEmail(email, key);

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
                    saveKeys(keys);
                    console.log(`🔄 Subscription renewed for ${email}`);
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
                    console.log(`⚠️ Subscription payment failed for ${email}`);
                }
                break;
            }

            // ===============================
            // Subscription Cancelled
            // ===============================
            case 'customer.subscription.deleted': {
                const subscription = event.data.object;

                // Must fetch customer to get email
                const customer = await stripe.customers.retrieve(subscription.customer);
                const email = customer.email;

                if (!email) break;

                const keys = loadKeys();
                const user = keys.find(k => k.email === email);

                if (user) {
                    user.active = false;
                    saveKeys(keys);
                    console.log(`❌ Subscription cancelled for ${email}`);
                }
                break;
            }
        }

        res.json({ received: true });
    });
};
