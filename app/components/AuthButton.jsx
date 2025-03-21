// components/LogoutButton.js
'use client';
import { signOut, signIn, useSession } from 'next-auth/react';

const AuthButton = () => {
  const { data: session } = useSession();

  if (session) {
    // User is logged in
    return (
      <button onClick={() => signOut({ callbackUrl: '/' })}>Logout</button>
    );
  } else {
    // User is not logged in
    return <button onClick={() => signIn()}>Login</button>;
  }
};

export default AuthButton;
