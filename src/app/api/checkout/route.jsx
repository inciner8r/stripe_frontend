const stripe = require("stripe")(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export const POST = async () => {
  try {
    const session = await stripe.checkout.sessions.create({
      submit_type: "donate",
      payment_method_types: ["card"],
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: "price_1OdzgBSAcOZ5DlUsLoKqPBzN",
          quantity: 1,
        },
      ],
      mode: "payment",
      mode: "payment",
      success_url: `http://localhost:3000/?success=true`,
      cancel_url: `http://localhost:3000/?canceled=true`,
    });

    return Response.json({
      url: session.url,
    });
  } catch (err) {
    console.error(err.message);

    return Response.json(
      {
        error: err.message,
      },
      { status: 500 }
    );
  }
};
