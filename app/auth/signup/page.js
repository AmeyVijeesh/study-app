'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

const SignUp = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Input validation
    if (!email || !password || !name) {
      setError('Please fill in all fields');
      return;
    }

    try {
      // Make a POST request to the sign-up API route
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/auth/login'); // Redirect to login
      } else {
        setError(data.message || 'Error creating account. Please try again.');
      }
    } catch (err) {
      setError('Error creating account. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', textAlign: 'center' }}>
      <h1>Create an Account</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Google Sign-in */}
      <button
        onClick={() => signIn('google', { callbackUrl: '/' })}
        style={{
          backgroundColor: '#4285F4',
          color: 'white',
          border: 'none',
          padding: '10px',
          borderRadius: '5px',
          cursor: 'pointer',
          width: '100%',
          marginBottom: '10px',
        }}
      >
        Continue with Google
      </button>

      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
        </div>
        <button
          type="submit"
          style={{
            backgroundColor: '#333',
            color: 'white',
            border: 'none',
            padding: '10px',
            borderRadius: '5px',
            cursor: 'pointer',
            width: '100%',
          }}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
