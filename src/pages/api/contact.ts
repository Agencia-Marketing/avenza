import type { APIRoute } from 'astro';

export const prerender = false;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string,
  );
}

export const POST: APIRoute = async ({ request, locals }) => {
  const wantsJson = (request.headers.get('accept') || '').includes('application/json');
  const env = (locals as any)?.runtime?.env ?? {};

  const reply = (status: number, ok: boolean, error?: string) => {
    if (wantsJson) {
      return new Response(JSON.stringify({ ok, error }), {
        status,
        headers: { 'content-type': 'application/json' },
      });
    }
    // No-JS fallback: minimal HTML response.
    const msg = ok ? 'Gracias, tu mensaje fue enviado. / Thank you, your message was sent.' : (error || 'Error');
    return new Response(
      `<!doctype html><meta charset="utf-8"><title>Avenza</title><body style="font-family:sans-serif;max-width:640px;margin:4rem auto;padding:0 1rem"><p>${esc(msg)}</p><p><a href="javascript:history.back()">&larr; Volver / Back</a></p></body>`,
      { status, headers: { 'content-type': 'text/html; charset=utf-8' } },
    );
  };

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return reply(400, false, 'Invalid form submission.');
  }

  // Honeypot: silently accept bots without sending anything.
  if ((form.get('company') as string)?.trim()) {
    return reply(200, true);
  }

  const name = ((form.get('name') as string) || '').trim();
  const email = ((form.get('email') as string) || '').trim();
  const message = ((form.get('message') as string) || '').trim();
  const service = ((form.get('service') as string) || '').trim();
  const type = ((form.get('type') as string) || '').trim();
  const lang = ((form.get('lang') as string) || 'es').trim();

  if (!name || !email || !message) {
    return reply(400, false, 'Missing required fields.');
  }
  if (!EMAIL_RE.test(email) || message.length > 5000 || name.length > 200) {
    return reply(400, false, 'Invalid input.');
  }

  const to = env.CONTACT_TO || 'info@avenzafinancial.com';
  // `from` must be an address on a Resend-verified domain.
  const from = env.CONTACT_FROM || 'Avenza Website <onboarding@resend.dev>';

  const html = `
    <h2>Nuevo mensaje desde el sitio (${esc(lang)})</h2>
    <p><strong>Nombre:</strong> ${esc(name)}</p>
    <p><strong>Email:</strong> ${esc(email)}</p>
    <p><strong>Servicio:</strong> ${esc(service || '—')}</p>
    <p><strong>Tipo:</strong> ${esc(type || '—')}</p>
    <p><strong>Mensaje:</strong></p>
    <p style="white-space:pre-wrap">${esc(message)}</p>
  `;

  // Dry-run when no API key configured (local dev / not yet provisioned).
  if (!env.RESEND_API_KEY) {
    console.log('[contact] DRY RUN (no RESEND_API_KEY). Would send:', { to, from, name, email, service, type });
    return reply(200, true);
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Consulta web — ${name}${service ? ` (${service})` : ''}`,
        html,
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      console.error('[contact] Resend error', res.status, detail);
      return reply(502, false, 'Email service error.');
    }
    return reply(200, true);
  } catch (err) {
    console.error('[contact] send failed', err);
    return reply(500, false, 'Unexpected error.');
  }
};

// Reject non-POST methods cleanly.
export const ALL: APIRoute = () => new Response('Method Not Allowed', { status: 405 });
