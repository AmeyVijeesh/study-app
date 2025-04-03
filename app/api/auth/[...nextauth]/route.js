import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcrypt';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { ObjectId } from 'mongodb';

export const authOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    // ✅ Google Authentication (Signup & Login)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // ✅ Email/Password Authentication
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await connectToDatabase();
        const user = await User.findOne({ email: credentials.email });

        if (!user) throw new Error('User not found');
        if (!user.password)
          throw new Error('Use Google sign-in for this account');

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) throw new Error('Incorrect password');

        return { id: user._id.toString(), name: user.name, email: user.email };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      await connectToDatabase();

      if (account.provider === 'google') {
        let existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          existingUser = new User({
            name: user.name,
            email: user.email,
            password: null,
          });
          await existingUser.save();
        }
        user.id = existingUser._id.toString();
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id.toString();
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
