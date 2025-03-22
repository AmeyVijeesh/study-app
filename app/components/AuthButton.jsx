// components/LogoutButton.js
'use client';
import { signOut, signIn, useSession } from 'next-auth/react';
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
    return <button onClick={() => signIn()}>Login</button>;
  }
};

export default AuthButton;
