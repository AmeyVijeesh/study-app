'use client';

import { useSession } from 'next-auth/react';
import NavbarSignedIn from './NavbarSignedIn';
import NavbarSignedOut from './NavbarSignedOut';

export default function NavbarWrapper() {
  const { data: session } = useSession();

  return session ? <NavbarSignedIn /> : <NavbarSignedOut />;
}
