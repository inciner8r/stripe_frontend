"use client";

import Head from "next/head";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import GetStripe from "../lib/stripe.js";
import { loadStripe } from "@stripe/stripe-js";
import { redirect } from "next/dist/server/api-utils/index.js";
import { useRouter } from "next/navigation";
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      console.log("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      console.log(
        "Order canceled -- continue to shop around and checkout when you’re ready."
      );
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Email:", email);
    console.log("Price:", price);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify({ amount: price }),
    });

    res.json().then((data) => {
      router.push(data.url);
    });
    if (res.statusCode === 500) {
      console.error(data.message);
      return;
    }
  };
  return (
    <div className="container">
      <Head>
        <title>Price Form</title>
        <meta name="description" content="Next.js Tailwind CSS Price Form" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-screen flex flex-col h-screen justify-center items-center">
        <div
          className=" px-24 py-12 flex flex-col items-center rounded-2xl"
          style={{
            background: "linear-gradient(145deg, #9eaff5, #8594ce)",
            boxShadow: "29px 29px 83px #7683b7,-29px -29px 83px #b2c5ff",
          }}
        >
          <h1 className="text-3xl font-semibold mb-4">Price Form</h1>
          <form onSubmit={handleSubmit} className="flex flex-col ">
            <div className="form-group">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 mb-2 p-2 border rounded-md w-full"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Price (USD)
              </label>
              <input
                type="number"
                id="price"
                className="mt-1 mb-2 p-2 border rounded-md w-full"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-3 rounded-md w-fit mx-auto mt-6"
              style={{
                background: "linear-gradient(145deg, #4a5eb1, #3e4f95)",
                boxShadow: "5px 5px 10px #2f3c70,-5px -5px 10px #576fd0",
              }}
            >
              Submit
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
