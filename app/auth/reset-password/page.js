'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage({ searchParams }) {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const token = searchParams?.token;

  async function handleResetPassword(e) {
    e.preventDefault();

    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();
    setMessage(data.message);

    if (res.ok) {
      setTimeout(() => router.push('/auth/login'), 3000);
    }
  }

  return (
    <form onSubmit={handleResetPassword}>
      <h2>Reset Password</h2>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter new password"
        required
      />
      <button type="submit">Reset Password</button>
      {message && <p>{message}</p>}
    </form>
  );
}
