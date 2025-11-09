import {transporter} from "./mailTransport";

const isDev = process.env.NODE_ENV === "development";

// templates
import {confirmationHTML} from "./mailTemplates";

export async function sendConfirmationEmail(email: string, url: string) {
  const fromAddress = isDev
    ? '"Chronos DEV" <no-reply@chronos.local>'
    : `"Chronos" <${process.env.MAIL_USER}>`;

  await transporter.sendMail({
    from: fromAddress,
    to: email,
    subject: "Confirm Your Email Address – Chronos",
    html: confirmationHTML(url),
  });
}