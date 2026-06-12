import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  const { login, signup } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const redirect = searchParams.get('redirect') || '/dashboard';

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (tab === 'signup') {
        await signup(form.name, form.email, form.password);
        showToast('Account created successfully');
        navigate(redirect, { replace: true });
      } else {
        const isAdmin = form.email === 'admin@consulthub.com';
        await login(form.email, form.password, isAdmin);
        showToast('Login successful');
        const target = isAdmin ? '/admin' : redirect;
        navigate(target, { replace: true });
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-brand">
          <span>🎙</span>
          <strong>ConsultHub</strong>
        </Link>

        <h1>{tab === 'login' ? 'Welcome back' : 'Create account'}</h1>
        <p className="auth-subtitle">
          {tab === 'login'
            ? 'Login to access clients, consultations and recordings'
            : 'Sign up to start managing your consultations'}
        </p>

        <div className="auth-tabs">
          <button
            type="button"
            className={tab === 'login' ? 'active' : ''}
            onClick={() => setTab('login')}
          >
            Login
          </button>
          <button
            type="button"
            className={tab === 'signup' ? 'active' : ''}
            onClick={() => setTab('signup')}
          >
            Sign Up
          </button>
        </div>

        <form className="form auth-form" onSubmit={handleSubmit}>
          {tab === 'signup' && (
            <label>
              Full Name
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
                required
              />
            </label>
          )}

          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@email.com"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Enter password"
              minLength={6}
              required
            />
          </label>

          <button type="submit" className="btn btn-dark btn-lg auth-submit" disabled={submitting}>
            {submitting
              ? 'Please wait...'
              : tab === 'login'
                ? 'Login'
                : 'Create Account'}
          </button>
        </form>

        <Link to="/" className="auth-back">← Back to Home</Link>
      </div>
    </div>
  );
}
