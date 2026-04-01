import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Number(amount) * 100,
      currency: 'inr',
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
