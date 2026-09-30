import type { APIRoute } from 'astro';
import { z } from 'astro/zod';
import nodemailer from 'nodemailer';
import { path } from '@/i18n/routes';

/** Rendered on demand (Vercel function, region fra1). Everything else on the site is static. */
export const prerender = false;

const MIN_FILL_MS = 3000;
const opt = (max: number) => z.string().trim().max(max).optional().or(z.literal(''));

const common = {
  locale: z.enum(['de', 'en']),
  name: z.string().trim().min(2).max(120),
  email: z.email().max(200),
  phone: opt(60),
  message: opt(4000),
  privacy: z.literal('yes'),
  website: z.string().max(0).optional().or(z.literal('')),
  ts: z.coerce.number().int().positive(),
};

const schema = z.discriminatedUnion('track', [
  z.object({
    track: z.literal('auto'),
    ...common,
    vehicle: z.string().trim().min(2).max(120),
    vehicleClass: opt(60),
    package: opt(40),
    date: opt(20),
  }),
  z.object({
    track: z.literal('aviation'),
    ...common,
    company: z.string().trim().min(2).max(160),
    role: opt(120),
    aircraftType: z.string().trim().min(2).max(120),
    registration: opt(20),
    location: z.string().trim().min(3).max(120),
    timeframe: opt(200),
    services: z.array(z.string().trim().max(80)).max(12).optional(),
  }),
]);

type Inquiry = z.infer<typeof schema>;

const esc = (v: string) =>
  v.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  );

function rows(data: Inquiry): [string, string][] {
  const base: [string, string | undefined][] =
    data.track === 'auto'
      ? [
          ['Name', data.name],
          ['E-Mail', data.email],
          ['Telefon', data.phone],
          ['Fahrzeug', data.vehicle],
          ['Fahrzeugklasse', data.vehicleClass],
          ['Paket', data.package],
          ['Wunschtermin', data.date],
          ['Nachricht', data.message],
        ]
      : [
          ['Unternehmen', data.company],
          ['Name', data.name],
          ['Funktion', data.role],
          ['E-Mail', data.email],
          ['Telefon', data.phone],
          ['Muster', data.aircraftType],
          ['Kennzeichen', data.registration],
          ['Standort', data.location],
          ['Zeitfenster', data.timeframe],
          ['Leistungen', data.services?.join(', ')],
          ['Nachricht', data.message],
        ];
  return base.filter((r): r is [string, string] => Boolean(r[1]));
}

function subject(data: Inquiry) {
  return data.track === 'auto'
    ? `[Paintfix] Anfrage Fahrzeugaufbereitung – ${data.vehicle}`
    : `[Paintfix Aviation] Anfrage – ${data.aircraftType} @ ${data.location}`;
}

function autoReply(data: Inquiry) {
  const aviation = data.track === 'aviation';
  if (data.locale === 'de') {
    return {
      subject: aviation ? 'Ihre Anfrage bei Paintfix Aviation' : 'Ihre Anfrage bei Paintfix',
      text: `Guten Tag,\n\nvielen Dank für Ihre Anfrage. Sie ist bei uns angekommen. Wir melden uns ${
        aviation
          ? 'mit Umfang und Angebot'
          : 'innerhalb eines Werktags mit Terminvorschlag und Preis'
      }.\n\nMit freundlichen Grüßen\n${aviation ? 'Paintfix Aviation' : 'Paintfix'} · Telgte`,
    };
  }
  return {
    subject: aviation ? 'Your request to Paintfix Aviation' : 'Your request to Paintfix',
    text: `Hello,\n\nthank you for your request. It has reached us, and we will get back to you ${
      aviation ? 'with scope and a quote' : 'within one working day with a proposed date and price'
    }.\n\nKind regards\n${aviation ? 'Paintfix Aviation' : 'Paintfix'} · Telgte, Germany`,
  };
}

function reply(
  request: Request,
  status: number,
  body: { ok: boolean; error?: string },
  locale: 'de' | 'en' = 'de',
) {
  const wantsJson = request.headers.get('accept')?.includes('application/json');
  if (wantsJson) {
    return new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  // No-JS fallback: back to the contact page with a status flag.
  const target = `${path('contact', locale)}?${body.ok ? 'sent=1' : 'error=1'}`;
  return new Response(null, { status: 303, headers: { Location: target } });
}

export const POST: APIRoute = async ({ request }) => {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return reply(request, 400, { ok: false, error: 'invalid_body' });
  }

  const raw: Record<string, unknown> = Object.fromEntries(form.entries());
  raw.services = form.getAll('services').map(String);
  const locale = raw.locale === 'en' ? 'en' : 'de';

  // Spam traps: filled honeypot or a form submitted faster than a human can. Pretend success.
  if (raw.website || Date.now() - Number(raw.ts) < MIN_FILL_MS) {
    return reply(request, 200, { ok: true }, locale);
  }

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return reply(request, 422, { ok: false, error: 'validation' }, locale);
  }
  const data = parsed.data;

  const env = process.env;
  const to = data.track === 'aviation' ? env.MAIL_TO_AVIATION : env.MAIL_TO_AUTO;
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS || !to) {
    if (import.meta.env.DEV) {
      console.info(
        '[contact] SMTP not configured, inquiry logged only:',
        subject(data),
        rows(data),
      );
      return reply(request, 200, { ok: true }, locale);
    }
    console.error('[contact] SMTP not configured');
    return reply(request, 500, { ok: false, error: 'not_configured' }, locale);
  }

  const transport = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT ?? 587),
    secure: Number(env.SMTP_PORT) === 465,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  });
  const from = env.MAIL_FROM ?? env.SMTP_USER;
  const lines = rows(data);

  try {
    await transport.sendMail({
      from,
      to,
      replyTo: data.email,
      subject: subject(data),
      text: lines.map(([k, v]) => `${k}: ${v}`).join('\n'),
      html: `<table cellpadding="6" style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">${lines
        .map(
          ([k, v]) =>
            `<tr><td style="color:#5b6168;vertical-align:top">${esc(k)}</td><td>${esc(v).replace(/\n/g, '<br>')}</td></tr>`,
        )
        .join('')}</table>`,
    });
    // Confirmation to the sender. Deliberately contains no user-submitted text.
    const ack = autoReply(data);
    await transport
      .sendMail({ from, to: data.email, subject: ack.subject, text: ack.text })
      .catch((err) => {
        console.warn('[contact] auto-reply failed', err);
      });
  } catch (err) {
    console.error('[contact] send failed', err);
    return reply(request, 502, { ok: false, error: 'send_failed' }, locale);
  }

  return reply(request, 200, { ok: true }, locale);
};

export const ALL: APIRoute = () => new Response(null, { status: 405, headers: { Allow: 'POST' } });
