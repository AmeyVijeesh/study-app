import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcrypt';

export async function POST(req) {
  const { token, password } = await req.json();

  await connectToDatabase();
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return Response.json(
      { message: 'Invalid or expired token' },
      { status: 400 }
    );
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return Response.json({ message: 'Password has been reset successfully' });
}
