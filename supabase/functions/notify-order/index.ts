// Edge Function «notify-order»: надсилає сповіщення про нове замовлення в Telegram.
// Її викликає база (public.notify_new_order) одразу після оформлення замовлення.
// Токен бота береться з Supabase Vault через tg_claim_order — у коді його немає.
import { createClient } from "jsr:@supabase/supabase-js@2";

const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  let orderId: number;
  try {
    orderId = Number((await req.json()).order_id);
  } catch {
    return new Response("Bad request", { status: 400 });
  }
  if (!Number.isInteger(orderId) || orderId <= 0) return new Response("Bad request", { status: 400 });

  // Кожне замовлення можна «забрати» лише один раз — повторний виклик поверне null.
  const { data, error } = await db.rpc("tg_claim_order", { p_order: orderId });
  if (error) return new Response("DB: " + error.message, { status: 500 });
  if (!data) return new Response("Nothing to send", { status: 200 });

  const r = await fetch(`https://api.telegram.org/bot${data.token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: data.chat_id, text: data.text, parse_mode: "HTML", disable_web_page_preview: true }),
  });
  const reply = await r.json().catch(() => ({}));
  if (!r.ok) {
    // не вийшло — знімаємо позначку, щоб можна було повторити
    await db.from("orders").update({ notified_at: null }).eq("id", orderId);
    return new Response("Telegram: " + (reply.description ?? r.status), { status: 502 });
  }
  return new Response("Sent", { status: 200 });
});
