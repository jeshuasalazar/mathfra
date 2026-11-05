import "server-only";
import Stripe from "stripe";
import { env } from "./env";

let stripe: Stripe | null = null;
export function getStripe() {
  if (!env.stripeSecret) return null;
  stripe ??= new Stripe(env.stripeSecret);
  return stripe;
}
