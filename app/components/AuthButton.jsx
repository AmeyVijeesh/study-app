// components/LogoutButton.js
'use client';
import { signOut, signIn, useSession, signUp } from 'next-auth/react';
import Link from 'next/link';

const AuthButton = () => {
  const { data: session } = useSession();

  if (session) {
    // User is logged in
    return (
      <div>
        <button onClick={() => signOut({ callbackUrl: '/' })}>Logout</button>
        <Link href="/dashboard">Go to dash</Link>
      </div>
    );
  } else {
    // User is not logged in
    return (
      <div>
        <button onClick={() => signIn('google')}>Login google</button>
        <button onClick={() => signIn()}>Login normal</button>

        <div>
          <Link href="/auth/signup">Signup</Link>
        </div>
      </div>
    );
  }
};

export default AuthButton;
