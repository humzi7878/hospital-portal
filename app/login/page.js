'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError('Email ya password galat hai. Dobara try karein.');
      setLoading(false);
      return;
    }
    router.push('/dashboard');
    router.refresh();
  }

  return (
    <main className="login-wrap">
      <section className="login-side">
        <h1>Hospital Staff Portal</h1>
        <p>Attendance, staff records aur salary ek jagah. Apne account se sign in karein.</p>
      </section>
      <section className="login-form-wrap">
        <form onSubmit={onSubmit} className="login-form">
          <h2>Sign in</h2>
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
          </label>
          {error && <p className="error" role="alert">{error}</p>}
          <button className="btn" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
        </form>
      </section>
    </main>
  );
}
