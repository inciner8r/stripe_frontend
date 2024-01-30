import { Stripe, loadStripe } from "@stripe/stripe-js";

const GetStripe = () => {
  var stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  );
  return stripePromise;
};

export default GetStripe;
