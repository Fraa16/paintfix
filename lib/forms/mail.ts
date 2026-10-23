/**
 * Mailversand über die Resend-API (README 2), nur auf dem Server. Umgebungsvariablen (Vercel):
 *
 *   RESEND_API_KEY      API-Schlüssel von Resend
 *   MAIL_FROM           Absender mit bei Resend bestätigter Domain, z. B. „PaintFix <anfrage@…>“
 *   MAIL_FROM_AVIATION  optional, Absender für Aviation (sonst MAIL_FROM)
 *   MAIL_TO             Postfach für Anfragen
 *   MAIL_TO_AVIATION    optional, Postfach für Aviation (sonst MAIL_TO)
 *
 * Ohne Einrichtung schreibt die Entwicklung die Mail ins Server-Log und meldet Erfolg. In der
 * Produktion scheitert der Versand, und das Formular zeigt den Hinweis mit Telefonnummer: Eine
 * Anfrage darf nie als gesendet erscheinen, wenn sie niemand erhält.
 */
export type Area = "car" | "aviation";

export interface Mail {
  area: Area;
  /** Empfänger; ohne Angabe das Postfach des Bereichs (MAIL_TO bzw. MAIL_TO_AVIATION). */
  to?: string;
  replyTo?: string;
  subject: string;
  text: string;
}

const env = (name: string) => process.env[name]?.trim() || undefined;

export async function sendMail(mail: Mail): Promise<boolean> {
  const aviation = mail.area === "aviation";
  const key = env("RESEND_API_KEY");
  const from = (aviation && env("MAIL_FROM_AVIATION")) || env("MAIL_FROM");
  const to = mail.to ?? ((aviation && env("MAIL_TO_AVIATION")) || env("MAIL_TO"));

  if (!key || !from || !to) {
    if (process.env.NODE_ENV !== "production") {
      console.info(
        `[Mail nicht versendet, Resend nicht eingerichtet]\nAn: ${to ?? "(MAIL_TO fehlt)"}\n` +
          `Betreff: ${mail.subject}\n\n${mail.text}\n`,
      );
      return true;
    }
    console.error("Mailversand nicht eingerichtet: RESEND_API_KEY, MAIL_FROM und MAIL_TO setzen.");
    return false;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        subject: mail.subject,
        text: mail.text,
        ...(mail.replyTo && { reply_to: mail.replyTo }),
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      console.error(`Resend ${res.status}: ${await res.text()}`);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Resend nicht erreichbar:", error);
    return false;
  }
}
