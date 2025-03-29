'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import '@/styles/auth.css';
import Link from 'next/link';

const SignUp = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !name) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/auth/login');
      } else {
        setError(data.message || 'Error creating account. Please try again.');
      }
    } catch (err) {
      setError('Error creating account. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="auth-title">Create an Account.</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="auth-input">
            <label className="auth-label">Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="auth-text"
            />
          </div>
          <div className="auth-input">
            <label className="auth-label">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="auth-text"
            />
          </div>
          <div className="auth-input">
            <label className="auth-label">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="auth-text"
            />
          </div>
          <div className="auth-btns">
            <button
              onClick={() => signIn('google', { callbackUrl: '/' })}
              className="auth-submit"
              type="button"
            >
              <i className="fab fa-google"></i> Continue with Google
            </button>
            <button type="submit" className="auth-submit">
              Sign Up
            </button>{' '}
            <p>
              <Link href="/auth/login">Already have an account? Login.</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
