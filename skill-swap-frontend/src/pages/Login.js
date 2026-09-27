import React, { useState, useContext } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/login', form);
      login(response.data);
      navigate('/dashboard');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Invalid username or password');
      } else {
        setError('Login failed. Please try again.');
      }
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
        position: 'absolute', top: '15%', left: '20%',
        width: 'clamp(160px, 30vw, 360px)', height: 'clamp(160px, 30vw, 360px)',
        background: 'rgba(99, 102, 241, 0.25)',
        borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '15%', right: '20%',
        width: 'clamp(140px, 28vw, 340px)', height: 'clamp(140px, 28vw, 340px)',
        background: 'rgba(168, 85, 247, 0.2)',
        borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none',
      }} />

      {/* Glass Card */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: 440,
        padding: 'clamp(28px, 6vw, 44px) clamp(20px, 5vw, 36px)',
        borderRadius: 'clamp(16px, 4vw, 24px)',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5), 0 0 30px rgba(99, 102, 241, 0.2)',
        color: '#f8fafc',
      }}>
        {/* Header with Icon */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 60, height: 60, borderRadius: '50%', margin: '0 auto 14px',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 25px rgba(99, 102, 241, 0.65)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 3h5v5" />
              <path d="M4 20L21 3" />
              <path d="M21 16v5h-5" />
              <path d="M15 15l6 6" />
              <path d="M4 4l5 5" />
            </svg>
          </div>
          <h2 style={{
            margin: '0 0 6px 0',
            fontSize: 'clamp(1.6rem, 5vw, 2rem)',
            fontWeight: 800,
            letterSpacing: '-0.5px',
            background: 'linear-gradient(135deg, #ffffff 40%, #c7d2fe 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Welcome Back
          </h2>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8' }}>
            Sign in to continue swapping skills
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#c7d2fe', marginBottom: 6 }}>
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={form.username}
              onChange={handleChange}
              required
              autoFocus
              style={inputStyle}
              onFocus={e => {
                e.target.style.borderColor = '#818cf8';
                e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.35)';
              }}
              onBlur={e => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.16)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#c7d2fe', marginBottom: 6 }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              style={inputStyle}
              onFocus={e => {
                e.target.style.borderColor = '#818cf8';
                e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.35)';
              }}
              onBlur={e => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.16)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {error && (
            <div style={{
              padding: '10px 14px',
              borderRadius: 10,
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              color: '#fca5a5',
              fontSize: '0.88rem',
              textAlign: 'center',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 4,
              padding: '14px',
              borderRadius: 12,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: '#ffffff',
              fontSize: '1rem',
              fontWeight: 700,
              border: 'none',
              cursor: loading ? 'default' : 'pointer',
              opacity: loading ? 0.7 : 1,
              boxShadow: '0 4px 20px rgba(99, 102, 241, 0.45)',
              transition: 'all 0.2s',
              minHeight: 50,
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
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        {/* Footer */}
        <p style={{ marginTop: 22, textAlign: 'center', fontSize: '0.9rem', color: '#94a3b8' }}>
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/register')}
            style={{
              background: 'none', border: 'none', padding: 0,
              color: '#818cf8', fontWeight: 600, cursor: 'pointer',
              textDecoration: 'underline', fontSize: '0.9rem',
            }}
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
