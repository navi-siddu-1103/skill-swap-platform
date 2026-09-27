import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { to: '/profile',   label: 'My Profile', icon: '👤' },
    { to: '/swaps',     label: 'My Swaps',   icon: '🔄' },
    { to: '/search',    label: 'Find Partners', icon: '🔍' },
  ];

  return (
    <nav style={{
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(99, 102, 241, 0.2)',
      boxShadow: '0 2px 20px rgba(0,0,0,0.4)',
      position: 'sticky',
      top: 0,
      zIndex: 9000,
      width: '100%',
    }}>
      <div style={{
        maxWidth: 1100,
        margin: '0 auto',
        padding: '0 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 60,
      }}>
        {/* Logo */}
        <div
          onClick={() => navigate('/dashboard')}
          style={{
            cursor: 'pointer',
            fontWeight: 800,
            fontSize: '1.25rem',
            letterSpacing: '-0.5px',
            background: 'linear-gradient(135deg, #ffffff 40%, #c7d2fe 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            userSelect: 'none',
          }}
        >
          <span style={{ fontSize: '1.4rem' }}>⚡</span>
          Skill Swap
        </div>

        {/* Desktop Nav Links */}
        <ul style={{
          display: 'flex',
          gap: 4,
          listStyle: 'none',
          margin: 0,
          padding: 0,
          alignItems: 'center',
        }}
          className="desktop-nav"
        >
          {navLinks.map(link => (
            <li key={link.to}>
              <Link
                to={link.to}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '7px 14px',
                  borderRadius: 10,
                  color: '#c7d2fe',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  transition: 'all 0.18s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(99,102,241,0.18)';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#c7d2fe';
                }}
              >
                <span style={{ fontSize: '0.95rem' }}>{link.icon}</span>
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <button
              onClick={handleLogout}
              style={{
                padding: '7px 16px',
                borderRadius: 10,
                background: 'rgba(239,68,68,0.15)',
                border: '1px solid rgba(239,68,68,0.35)',
                color: '#fca5a5',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.18s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.28)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
            >
              Logout
            </button>
          </li>
        </ul>

        {/* Hamburger Button (Mobile only) */}
        <button
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
          style={{
            display: 'none',
            background: 'rgba(99,102,241,0.15)',
            border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: 10,
            padding: '8px 10px',
            cursor: 'pointer',
            color: '#c7d2fe',
            fontSize: '1.3rem',
            lineHeight: 1,
            minHeight: 44,
            minWidth: 44,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          className="hamburger-btn"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div style={{
          background: 'rgba(15, 23, 42, 0.97)',
          borderTop: '1px solid rgba(99,102,241,0.15)',
          padding: '12px 16px 20px',
        }}>
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '13px 14px',
                borderRadius: 12,
                color: '#c7d2fe',
                textDecoration: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                marginBottom: 4,
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.18)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ fontSize: '1.15rem' }}>{link.icon}</span>
              {link.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              marginTop: 8,
              padding: '13px',
              borderRadius: 12,
              background: 'rgba(239,68,68,0.15)',
              border: '1px solid rgba(239,68,68,0.35)',
              color: '#fca5a5',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'center',
            }}
          >
            Logout
          </button>
        </div>
      )}

      {/* Responsive style injected via <style> */}
      <style>{`
        @media (max-width: 700px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
        @media (min-width: 701px) {
          .hamburger-btn { display: none !important; }
          .desktop-nav { display: flex !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
