import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: 'calc(100vh - 60px)',
      padding: '32px 16px 60px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    }}>
      {/* Background Decorative Blur Orbs */}
      <div style={{
        position: 'absolute', top: '10%', left: '10%',
        width: 'clamp(180px, 35vw, 380px)', height: 'clamp(180px, 35vw, 380px)',
        background: 'rgba(99, 102, 241, 0.22)',
        borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', right: '10%',
        width: 'clamp(160px, 30vw, 360px)', height: 'clamp(160px, 30vw, 360px)',
        background: 'rgba(168, 85, 247, 0.18)',
        borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none',
      }} />

      {/* Main Glassmorphic Container */}
      <main style={{
        position: 'relative',
        width: '100%',
        maxWidth: 960,
        padding: 'clamp(24px, 5vw, 52px) clamp(16px, 4vw, 40px) clamp(28px, 5vw, 48px)',
        borderRadius: 'clamp(16px, 3vw, 28px)',
        background: 'rgba(255, 255, 255, 0.04)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.45)',
        textAlign: 'center',
        color: '#f8fafc',
      }}>
        {/* Glowing Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 16px', borderRadius: 999,
          background: 'rgba(99, 102, 241, 0.18)',
          border: '1px solid rgba(99, 102, 241, 0.35)',
          color: '#a5b4fc', fontSize: 'clamp(0.7rem, 2vw, 0.82rem)', fontWeight: 600,
          letterSpacing: '0.5px', textTransform: 'uppercase',
          marginBottom: 20,
        }}>
          <span>✨</span> The Peer-to-Peer Learning Network
        </div>

        {/* Heading */}
        <h1 style={{
          margin: '0 0 14px 0',
          fontSize: 'clamp(1.7rem, 5vw, 3rem)',
          fontWeight: 800,
          letterSpacing: '-1px',
          lineHeight: 1.15,
          background: 'linear-gradient(135deg, #ffffff 30%, #c7d2fe 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Welcome to Skill Swap
        </h1>

        {/* Subtitle */}
        <p style={{
          maxWidth: 680,
          margin: '0 auto 32px',
          fontSize: 'clamp(0.88rem, 2.5vw, 1.05rem)',
          lineHeight: 1.6,
          color: '#cbd5e1',
          fontWeight: 400,
          padding: '0 8px',
        }}>
          Connect, learn, and grow — one skill at a time. Empower yourself by sharing
          your talents and learning directly through engaging one-on-one exchanges.
        </p>

        {/* Quick Action CTAs */}
        <div style={{
          display: 'flex',
          gap: 12,
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: 40,
          padding: '0 8px',
        }}>
          <button
            onClick={() => navigate('/search')}
            style={{
              flex: '1 1 160px',
              maxWidth: 240,
              padding: 'clamp(11px, 2vw, 13px) clamp(16px, 3vw, 28px)',
              borderRadius: 14,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: '#ffffff',
              fontSize: 'clamp(0.88rem, 2.5vw, 0.98rem)',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(99, 102, 241, 0.45)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 25px rgba(99, 102, 241, 0.65)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(99, 102, 241, 0.45)';
            }}
          >
            <span>🔍</span> Find Partners
          </button>

          <button
            onClick={() => navigate('/profile')}
            style={{
              flex: '1 1 160px',
              maxWidth: 240,
              padding: 'clamp(11px, 2vw, 13px) clamp(14px, 3vw, 26px)',
              borderRadius: 14,
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              color: '#f8fafc',
              fontSize: 'clamp(0.88rem, 2.5vw, 0.98rem)',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.14)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.transform = 'none';
            }}
          >
            <span>👤</span> My Profile & Skills
          </button>
        </div>

        {/* Feature Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 'clamp(12px, 3vw, 24px)',
          textAlign: 'left',
        }}>
          <FeatureCard
            icon="🔍"
            title="Discover Talents"
            description="Explore diverse community profiles and find the perfect person to learn from or teach."
          />
          <FeatureCard
            icon="📅"
            title="Schedule Easily"
            description="Propose convenient times for skill exchanges and foster meaningful learning relationships."
          />
          <FeatureCard
            icon="💬"
            title="Live Interactive Chat"
            description="Chat in real-time with prospective partners to coordinate, share resources, and collaborate."
          />
        </div>
      </main>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div
    style={{
      padding: 'clamp(18px, 3vw, 28px) clamp(14px, 2.5vw, 24px)',
      borderRadius: 18,
      background: 'rgba(255, 255, 255, 0.04)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25)',
      transition: 'all 0.25s ease',
      cursor: 'default',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
      e.currentTarget.style.boxShadow = '0 12px 35px rgba(99, 102, 241, 0.25)';
      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'none';
      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
      e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.25)';
      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
    }}
  >
    <div style={{
      width: 46, height: 46, borderRadius: 14,
      background: 'rgba(99, 102, 241, 0.15)',
      border: '1px solid rgba(99, 102, 241, 0.3)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '1.3rem', marginBottom: 14,
    }}>
      {icon}
    </div>
    <h3 style={{ margin: '0 0 8px 0', fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', fontWeight: 700, color: '#f8fafc' }}>
      {title}
    </h3>
    <p style={{ margin: 0, fontSize: 'clamp(0.82rem, 2vw, 0.9rem)', lineHeight: 1.5, color: '#94a3b8' }}>
      {description}
    </p>
  </div>
);

export default Dashboard;
