import { NextResponse } from "next/server";
import config from "@/lib/config";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const { to, subject, html } = await req.json();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.env.nodemailer.emailUser,
      pass: config.env.nodemailer.emailPass,
    },
  });

  await transporter.sendMail({
    from: `"Permpus" <${config.env.nodemailer.emailUser}>`,
    to,
    subject,
    html,
  });

  return NextResponse.json({ success: true });
}
