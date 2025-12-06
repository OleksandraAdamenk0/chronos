import {transporter} from "./mailTransport";

const isDev = process.env.NODE_ENV === "development";

// templates
import {confirmationHTML, invitationHTML} from "./mailTemplates";
import {invitationLinkService} from "../invite/service";

const getAddress = () => {
  return  isDev
    ? '"Chronos DEV" <no-reply@chronos.local>'
    : `"Chronos" <${process.env.MAIL_USER}>`;
}

export async function sendConfirmationEmail(email: string, url: string) {
  const fromAddress = getAddress();

  await transporter.sendMail({
    from: fromAddress,
    to: email,
    subject: "Confirm Your Email Address - Chronos",
    html: confirmationHTML(url),
  });
}

export async function sendInvitationEmail(email: string, url: string, calendarName: string, inviter: string) {
  const fromAddress = getAddress();

  await transporter.sendMail({
    from: fromAddress,
    to: email,
    subject: "You've Been Invited to Join a Calendar - Chronos",
    html: invitationHTML(url, calendarName, inviter),
  });
}