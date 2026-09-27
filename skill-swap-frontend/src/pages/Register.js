import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const cleanUser = form.username.trim();
    const cleanEmail = form.email.trim();

    if (!cleanUser) {
      setError('Username cannot be empty');
      return;
    }
    if (!cleanEmail) {
      setError('Email cannot be empty');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await api.post('/auth/register', {
        username: cleanUser,
        password: form.password,
        email: cleanEmail,
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      console.error('Registration error:', err);
      const msg = err?.response?.data?.message || err?.response?.data;
      setError(typeof msg === 'string' ? msg : 'Registration failed. Try another username or email.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '13px 16px',
    borderRadius: 12,
    background: 'rgba(255, 255, 255, 0.07)',
    border: '1px solid rgba(255, 255, 255, 0.16)',
    color: '#ffffff',
    fontSize: '1rem',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.2s',
    minHeight: 50,
  };

  const handleFocus = e => {
    e.target.style.borderColor = '#818cf8';
    e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.35)';
  };
  const handleBlur = e => {
    e.target.style.borderColor = 'rgba(255, 255, 255, 0.16)';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'clamp(16px, 5vw, 32px)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background Glow Orbs */}
      <div style={{
        position: 'absolute', top: '10%', left: '15%',
        width: 'clamp(150px, 28vw, 360px)', height: 'clamp(150px, 28vw, 360px)',
        background: 'rgba(99, 102, 241, 0.25)',
        borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', right: '15%',
        width: 'clamp(130px, 25vw, 340px)', height: 'clamp(130px, 25vw, 340px)',
        background: 'rgba(168, 85, 247, 0.2)',
        borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none',
      }} />

      {/* Glass Card */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: 460,
        padding: 'clamp(24px, 6vw, 40px) clamp(18px, 5vw, 36px)',
        borderRadius: 'clamp(16px, 4vw, 24px)',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5), 0 0 30px rgba(99, 102, 241, 0.2)',
        color: '#f8fafc',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%', margin: '0 auto 12px',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 25px rgba(99, 102, 241, 0.65)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
          </div>
          <h2 style={{
            margin: '0 0 6px 0',
            fontSize: 'clamp(1.5rem, 5vw, 1.9rem)',
            fontWeight: 800,
            letterSpacing: '-0.5px',
            background: 'linear-gradient(135deg, #ffffff 40%, #c7d2fe 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Join Skill Swap
          </h2>
          <p style={{ margin: 0, fontSize: '0.88rem', color: '#94a3b8' }}>
            Create an account to start sharing and learning
          </p>
        </div>

        {success ? (
          <div style={{
            padding: '24px 16px', borderRadius: 16,
            background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)',
            textAlign: 'center', color: '#6ee7b7',
          }}>
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>🎉</div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: 4 }}>Account created successfully!</div>
            <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>Redirecting you to login…</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#c7d2fe', marginBottom: 5 }}>
                Username
              </label>
              <input
                type="text"
                name="username"
                placeholder="Choose a username"
                value={form.username}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#c7d2fe', marginBottom: 5 }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="your.email@example.com"
                value={form.email}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#c7d2fe', marginBottom: 5 }}>
                Password (min 6 characters)
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  required
                  style={{ ...inputStyle, paddingRight: 48 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    background: 'none',
                    border: 'none',
                    color: showPassword ? '#a5b4fc' : '#94a3b8',
                    cursor: 'pointer',
                    padding: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'color 0.2s',
                    outline: 'none',
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#c7d2fe', marginBottom: 5 }}>
                Confirm Password
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  required
                  style={{ ...inputStyle, paddingRight: 48 }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(prev => !prev)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    background: 'none',
                    border: 'none',
                    color: showConfirmPassword ? '#a5b4fc' : '#94a3b8',
                    cursor: 'pointer',
                    padding: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'color 0.2s',
                    outline: 'none',
                  }}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                padding: '10px 14px', borderRadius: 10,
                background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.35)',
                color: '#fca5a5', fontSize: '0.88rem', textAlign: 'center',
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 4, padding: '14px', borderRadius: 12,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: '#ffffff', fontSize: '1rem', fontWeight: 700,
                border: 'none', cursor: loading ? 'default' : 'pointer',
                opacity: loading ? 0.7 : 1, boxShadow: '0 4px 20px rgba(99, 102, 241, 0.45)',
                transition: 'all 0.2s', minHeight: 50,
              }}
              onMouseEnter={e => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 25px rgba(99, 102, 241, 0.65)';
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(99, 102, 241, 0.45)';
              }}
            >
              {loading ? 'Creating Account…' : 'Create Account'}
            </button>
          </form>
        )}

        <p style={{ marginTop: 20, textAlign: 'center', fontSize: '0.9rem', color: '#94a3b8' }}>
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            style={{
              background: 'none', border: 'none', padding: 0,
              color: '#818cf8', fontWeight: 600, cursor: 'pointer',
              textDecoration: 'underline', fontSize: '0.9rem',
            }}
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
