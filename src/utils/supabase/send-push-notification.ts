import { webpush } from "npm:web-push";

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const VAPID_PUBLIC_KEY = Deno.env.get("VAPID_PUBLIC_KEY")!;
const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY")!;

webpush.setVapidDetails(
  "mailto:tu@email.com",
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

serve(async (req) => {
  try {
    const payload = await req.json();

    const { user_id, title, body, ...data } = payload.record;

    if (!user_id) {
      throw new Error("Falta user_id en el payload");
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")! // ¡SERVICE ROLE KEY!
    );

    const { data: subscriptions, error: dbError } = await supabaseAdmin
      .from("push_subscriptions")
      .select("subscription")
      .eq("user_id", user_id);

    if (dbError) throw dbError;
    if (!subscriptions || subscriptions.length === 0) {
      return new Response(
        JSON.stringify({ message: "No subscriptions found for user" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const notificationPayload = JSON.stringify({
      title: title || "Nueva Notificación",
      body: body || "Tienes una nueva alerta.",
      data: data,
    });

    const sendPromises = subscriptions.map(({ subscription }) =>
      webpush
        .sendNotification(subscription, notificationPayload)
        .catch(async (err) => {
          if (err.statusCode === 410) {
            console.warn(
              "Suscripción expirada, eliminando:",
              subscription.endpoint
            );
            await supabaseAdmin
              .from("push_subscriptions")
              .delete()
              .eq("subscription->>endpoint", subscription.endpoint);
          } else {
            console.error("Error enviando push:", err);
          }
        })
    );

    await Promise.all(sendPromises);

    return new Response(
      JSON.stringify({ success: true, sent: subscriptions.length }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(String(err?.message ?? err), { status: 500 });
  }
});
