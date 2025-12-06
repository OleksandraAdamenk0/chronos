const CLIENT = process.env.CLIENT;

export const confirmationHTML = (url: string) => {
  return `
    <div style="font-family: 'Segoe UI', Roboto, sans-serif; background-color: #18181b; color: #ddd; padding: 32px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #0db7f4; box-shadow: 0 0 20px rgb(130,60,205);">
      
      <h1 style="color: #f65ee9; text-align: center; font-weight: 700; letter-spacing: 1px; margin-bottom: 24px;">
        ✉️ Confirm Your Email Address
      </h1>
      
      <p style="font-size: 16px; color: #ccc; text-align: center; line-height: 1.6; margin-bottom: 28px;">
        Welcome to <a href="${CLIENT ? CLIENT : "#"}"><strong style="color: #0db7f4;">Chronos</strong></a>!<br>
        To complete your registration and activate your account, please verify your email address.
      </p>

      <div style="text-align: center; margin-bottom: 28px;">
        <a href="${url}"
           style="background-color: #a33aea; color: #f1f1f1; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 0 10px rgb(130,60,205); transition: all 0.2s;">
          ✅ Confirm My Email
        </a>
      </div>

      <p style="font-size: 14px; color: #888; text-align: center; margin-bottom: 32px;">
        If the button above doesn’t work, you can also confirm manually by opening this link:<br>
        <a href="${url}" style="color: #0db7f4; word-break: break-all;">${url}</a>
      </p>

      <hr style="border: none; border-top: 1px solid #333; margin: 32px 0;">

      <footer style="text-align: center; color: #666; font-size: 13px;">
        <p style="margin: 0;">This email was sent automatically by <strong style="color: #0db7f4;">Chronos</strong>.</p>
        <p style="margin: 4px 0 0 0;">If you didn’t request this, please ignore this message.</p>
      </footer>
    </div>
    `
}

export const invitationHTML = (url: string, calendarName: string, inviter: string) => {
  return `
    <div style="font-family: 'Segoe UI', Roboto, sans-serif; background-color: #18181b; color: #ddd; padding: 32px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #0db7f4; box-shadow: 0 0 20px rgb(130,60,205);">
      
      <h1 style="color: #0db7f4; text-align: center; font-weight: 700; letter-spacing: 1px; margin-bottom: 24px;">
        📅 Calendar Invitation
      </h1>

      <p style="font-size: 16px; color: #ccc; text-align: center; line-height: 1.6; margin-bottom: 28px;">
        <strong style="color: #f65ee9;">${inviter}</strong> has invited you to join the calendar<br>
        <strong style="color: #0db7f4;">${calendarName}</strong> on <a href="${CLIENT ? CLIENT : "#"}" style="color:#0db7f4;"><strong>Chronos</strong></a>.
      </p>

      <div style="text-align: center; margin-bottom: 28px;">
        <a href="${url}"
           style="background-color: #a33aea; color: #f1f1f1; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 0 10px rgb(130,60,205); transition: all 0.2s;">
          ➕ Accept Invitation
        </a>
      </div>

      <p style="font-size: 14px; color: #888; text-align: center; margin-bottom: 32px;">
        If the button above doesn’t work, you can join the calendar by opening this link:<br>
        <a href="${url}" style="color: #0db7f4; word-break: break-all;">${url}</a>
      </p>

      <hr style="border: none; border-top: 1px solid #333; margin: 32px 0;">

      <footer style="text-align: center; color: #666; font-size: 13px;">
        <p style="margin: 0;">This invitation was sent via <strong style="color: #0db7f4;">Chronos</strong>.</p>
        <p style="margin: 4px 0 0 0;">If you weren’t expecting this, you can safely ignore this email.</p>
      </footer>
    </div>
  `
}
