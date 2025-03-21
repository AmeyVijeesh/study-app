import bcrypt from 'bcrypt';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server'; // ✅ Import NextResponse

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
    await connectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ message: `Error: ${error}` }, { status: 500 });
  }
}
