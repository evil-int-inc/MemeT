import { loadStripe } from "@stripe/stripe-js";

/**
 * Stripe publishable key.
 * This is safe to expose on the frontend — it is not the secret key.
 * The secret key is stored only on the backend canister.
 */
export const STRIPE_PUBLISHABLE_KEY =
  "pk_test_51SfIyIK1zfEn4rUHn8nsT4Rn0sxtxtWndV9opLom3ZtwmrtOHsoqw96htRftrBy18XGux4lLhObAXomGFM2SCkz200FnmBopE1";

/**
 * Lazily-loaded Stripe instance.
 * Calling loadStripe multiple times with the same key returns the same promise,
 * but we hold a module-level reference so it loads only once.
 */
export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

/**
 * Build the success URL for a Stripe checkout session.
 * Stripe replaces {CHECKOUT_SESSION_ID} with the real session id.
 */
export function buildSuccessUrl(adId: string): string {
  const origin = window.location.origin;
  return `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}&ad_id=${encodeURIComponent(adId)}`;
}

/**
 * Build the cancel URL for a Stripe checkout session.
 */
export function buildCancelUrl(adId: string): string {
  const origin = window.location.origin;
  return `${origin}/payment-cancel?ad_id=${encodeURIComponent(adId)}`;
}
