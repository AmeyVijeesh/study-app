import { connectToDatabase } from '@/lib/mongodb';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { email } = await req.json();

  await connectToDatabase();
  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  const resetToken = Buffer.from(
    globalThis.crypto.getRandomValues(new Uint8Array(32))
  ).toString('hex');
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: { user: process.env.EMAIL_ID, pass: process.env.EMAIL_PASSWORD },
  });
  const resetUrl = `http://localhost:3000/auth/reset-password?token=${resetToken}`;

  await transporter.sendMail({
    to: email,
    from: `${process.env.EMAIL_ID}`,
    subject: 'Password Reset Request',
    html: `<p>You requested a password reset.</p>
           <p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
  });

  return NextResponse.json({ message: 'Reset link sent to your email' });
}
