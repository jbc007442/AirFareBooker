import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  try {
    const { amount, email, name } = await req.json();

    // ✅ Create Customer (like Stripe Checkout)
    const customer = await stripe.customers.create({
      email: email || undefined,
      name: name || undefined,
    });

    // ✅ Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Number(amount) * 100,
      currency: 'inr',

      customer: customer.id, // 🔥 attach customer

      // 🔥 Save card for future use
      setup_future_usage: 'off_session',

      // 🔥 Enable all payment methods
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return Response.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err: any) {
    console.error('Stripe Error:', err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
