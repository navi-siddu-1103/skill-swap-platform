import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      padding: '40px 24px 60px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    }}>
      {/* Background Decorative Blur Orbs */}
      <div style={{
        position: 'absolute', top: '10%', left: '15%',
        width: 380, height: 380,
        background: 'rgba(99, 102, 241, 0.22)',
        borderRadius: '50%', filter: 'blur(110px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '15%', right: '15%',
        width: 360, height: 360,
        background: 'rgba(168, 85, 247, 0.18)',
        borderRadius: '50%', filter: 'blur(110px)', pointerEvents: 'none',
      }} />

      {/* Main Glassmorphic Container */}
      <main style={{
        position: 'relative',
        width: '100%',
        maxWidth: 960,
        padding: '52px 40px 48px',
        borderRadius: 28,
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
          color: '#a5b4fc', fontSize: '0.82rem', fontWeight: 600,
          letterSpacing: '1px', textTransform: 'uppercase',
          marginBottom: 20,
        }}>
          <span>✨</span> The Peer-to-Peer Learning Network
        </div>

        {/* Heading */}
        <h1 style={{
          margin: '0 0 16px 0',
          fontSize: '3rem',
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
          margin: '0 auto 36px',
          fontSize: '1.05rem',
          lineHeight: 1.6,
          color: '#cbd5e1',
          fontWeight: 400,
        }}>
          Connect, learn, and grow — one skill at a time. Empower yourself by sharing your talents
          and learning directly through engaging one-on-one exchanges.
        </p>

        {/* Quick Action CTAs */}
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48 }}>
          <button
            onClick={() => navigate('/search')}
            style={{
              padding: '13px 28px',
              borderRadius: 14,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: '#ffffff',
              fontSize: '0.98rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(99, 102, 241, 0.45)',
              display: 'flex', alignItems: 'center', gap: 8,
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
              padding: '13px 26px',
              borderRadius: 14,
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              color: '#f8fafc',
              fontSize: '0.98rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 24,
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
      padding: '28px 24px',
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
      width: 48, height: 48, borderRadius: 14,
      background: 'rgba(99, 102, 241, 0.15)',
      border: '1px solid rgba(99, 102, 241, 0.3)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '1.4rem', marginBottom: 16,
    }}>
      {icon}
    </div>
    <h3 style={{
      margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc',
    }}>
      {title}
    </h3>
    <p style={{
      margin: 0, fontSize: '0.9rem', lineHeight: 1.5, color: '#94a3b8',
    }}>
      {description}
    </p>
  </div>
);

export default Dashboard;
