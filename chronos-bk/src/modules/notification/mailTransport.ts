import nodemailer from "nodemailer";

const isDev = process.env.NODE_ENV !== "production";

export const transporter = nodemailer.createTransport(isDev
  ? {
    host: process.env.MAIL_HOST || "localhost",
    port: Number(process.env.MAIL_PORT) || 1025,
    secure: false,
  }
  : {
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });