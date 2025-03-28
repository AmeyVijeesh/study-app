'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '@/styles/auth.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (!result.error) router.push('/dashboard');
    else alert(result.error);
  }

  async function handleGoogleSignIn() {
    signIn('google', { callbackUrl: '/dashboard' });
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="auth-title">Login to your Account.</h1>

        <form onSubmit={handleSubmit}>
          <div className="auth-input">
            <label className="auth-label">Email:</label>
            <input
              type="email"
              required
              className="auth-text"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="auth-input">
            <label className="auth-label">Password:</label>
            <input
              type="password"
              required
              className="auth-text"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="auth-btns">
            <button
              type="button"
              className="auth-submit"
              onClick={handleGoogleSignIn}
            >
              <i className="fab fa-google"></i> Continue with Google
            </button>
            <button type="submit" className="auth-submit">
              Log in
            </button>{' '}
            <Link href="/auth/signup">Don't have an account? Create one.</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
