import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  "pk_test_51RwOxF3wQoOvYXwRr8Mk9AxRPuv9rizutYEO59KJzLbd4H15ViuoceNnaC25c8SZdArUgcB8c3kdp58LXiIqZZpn00lAHajbq6"
);

export default function StripeProvider({ children }) {
  return <Elements stripe={stripePromise}>{children}</Elements>;
}
