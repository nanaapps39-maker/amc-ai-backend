const session = await stripe.checkout.sessions.create({
  mode: "subscription",
  line_items: [
    {
      price: process.env.STRIPE_PRICE_ID,
      quantity: 1
    }
  ],
  managed_payments: {
    enabled: true
  },
  success_url: `${YOUR_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${YOUR_DOMAIN}/cancel`
});
