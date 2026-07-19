const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async function createCheckoutSession(req, res) {
    try {
        const { plan } = req.body;

        // Your frontend domain
        const YOUR_DOMAIN = process.env.FRONTEND_DOMAIN;

        // Select correct price ID based on plan
        const priceId =
            plan === "annual"
                ? process.env.STRIPE_PRICE_ID_ANNUAL
                : process.env.STRIPE_PRICE_ID_MONTHLY;

        const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            line_items: [
                {
                    price: priceId,
                    quantity: 1
                }
            ],
            managed_payments: {
                enabled: true
            },
            success_url: `${YOUR_DOMAIN}/billing-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${YOUR_DOMAIN}/pricing`
        });

        res.json({ url: session.url });

    } catch (error) {
        console.error("❌ Error creating checkout session:", error);
        res.status(500).json({ error: "Failed to create checkout session" });
    }
};
