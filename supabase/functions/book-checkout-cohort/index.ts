// Stripe checkout for the Calm Magic book practitioner cohort tier (one-off).
// Guest checkout supported. Uses BOOK_COHORT_PRICE_ID env if set, otherwise
// inline price_data fallback so the funnel works out of the box.

import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";
import { z } from "https://esm.sh/zod@3.23.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BodySchema = z.object({
  email: z.string().trim().email().max(255).optional(),
  name: z.string().trim().max(120).optional(),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY missing");
    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    let userEmail: string | undefined;
    const auth = req.headers.get("Authorization");
    if (auth) {
      const supabaseClient = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_ANON_KEY")!,
        { global: { headers: { Authorization: auth } } },
      );
      const { data } = await supabaseClient.auth.getUser();
      userEmail = data.user?.email ?? undefined;
    }

    const parsed = BodySchema.safeParse(await req.json().catch(() => ({})));
    const body = parsed.success ? parsed.data : {};
    const email = userEmail ?? body.email;

    let customerId: string | undefined;
    if (email) {
      const list = await stripe.customers.list({ email, limit: 1 });
      customerId = list.data[0]?.id;
    }

    const cohortPriceId = Deno.env.get("BOOK_COHORT_PRICE_ID");
    const lineItem = cohortPriceId
      ? { price: cohortPriceId, quantity: 1 }
      : {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: 49700,
            product_data: {
              name: "Calm Magic — Practitioner Cohort",
              description:
                "Book + companion workbook + cohort access + signed edition.",
            },
          },
        };

    const origin = req.headers.get("origin") ?? "https://calm-magic.com";
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : email,
      line_items: [lineItem as Stripe.Checkout.SessionCreateParams.LineItem],
      mode: "payment",
      success_url: `${origin}/book/thanks?tier=cohort&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/book?canceled=1`,
      metadata: { tier: "cohort", source: "calm_magic_book" },
    });

    // Record pending order (best-effort)
    if (email) {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      );
      await supabase.from("book_orders").insert({
        email,
        tier: "cohort",
        stripe_session_id: session.id,
        amount: 49700,
        currency: "usd",
        status: "pending",
      });
    }

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
