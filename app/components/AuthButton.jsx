'use client';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import '@/styles/navbar.css';

const AuthButton = () => {
  const { data: session } = useSession();

  if (session) {
    return (
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="logoutBtn"
      >
        Logout
      </button>
    );
  } else {
    return (
      <Link
        href="/auth/signup"
        className="sign-in ms-lg-3 mt-2 mt-lg-0 get-started"
      >
        Get Started
      </Link>
    );
  }
};

export default AuthButton;
