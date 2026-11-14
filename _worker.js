// Cloudflare Pages Advanced Mode entry point.
// Handles POST /api/submit and serves all other requests from Pages assets.

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/submit") {
      if (request.method === "GET") {
        return json({ ok: true, service: "NEXORA Telegram notifier", endpoint: "/api/submit" });
      }
      if (request.method !== "POST") {
        return json({ ok: false, error: "Method not allowed." }, 405);
      }
      return handleSubmission(request, env);
    }
    return env.ASSETS.fetch(request);
  }
};

async function handleSubmission(request, env) {
  try {
    if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
      console.error("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID Pages binding");
      return json({ ok: false, error: "На сервере не настроены TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID в Cloudflare Pages → Settings → Variables and Secrets." }, 500);
    }
    if (!request.headers.get("content-type")?.includes("application/json")) {
      return json({ ok: false, error: "Ожидается JSON." }, 415);
    }
    const raw = await request.text();
    if (raw.length > 20000) return json({ ok: false, error: "Слишком большая заявка." }, 413);

    const data = JSON.parse(raw);
    if (!String(data.name || "").trim() || !String(data.contact || "").trim()) {
      return json({ ok: false, error: "Укажи имя и контакт для связи." }, 400);
    }

    const fields = [
      ["name", "Имя"],
      ["contact", "Контакт"],
      ["product", "Интересует"],
      ["comment", "Ответы и пожелания"],
      ["source", "Источник"]
    ];
    const lines = [`🖥️ <b>${escapeHtml(String(data.type || "Новая заявка NEXORA").slice(0, 100))}</b>`];
    for (const [key, title] of fields) {
      const value = data[key];
      if (value !== undefined && value !== null && String(value).trim()) {
        lines.push(`<b>${title}:</b>\n${escapeHtml(String(value).slice(0, 3500))}`);
      }
    }
    lines.push(`\n🕒 ${escapeHtml(new Date().toLocaleString("ru-RU", { timeZone: "Europe/Chisinau" }))}`);

    const telegramResponse = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: env.TELEGRAM_CHAT_ID,
        text: lines.join("\n\n"),
        parse_mode: "HTML",
        disable_web_page_preview: true
      })
    });
    const result = await telegramResponse.json().catch(() => ({ ok: false }));
    if (!telegramResponse.ok || !result.ok) {
      console.error("Telegram sendMessage failed", result.description || telegramResponse.status);
      return json({ ok: false, error: "Telegram не принял сообщение. Проверь токен, Chat ID и доступ бота к чату." }, 502);
    }
    return json({ ok: true, message_id: result.result?.message_id });
  } catch (error) {
    console.error("NEXORA Pages error", error);
    return json({ ok: false, error: error instanceof SyntaxError ? "Некорректные данные формы." : "Ошибка сервера при отправке заявки." }, 500);
  }
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }
  });
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}
