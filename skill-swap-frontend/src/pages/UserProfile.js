import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useParams, useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/users/${id}`)
      .then(res => { setProfile(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a5b4fc' }}>
        Loading user profile…
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fca5a5' }}>
        User not found.
      </div>
    );
  }

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      padding: '40px 24px 60px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      position: 'relative',
    }}>
      {/* Background Glow */}
      <div style={{
        position: 'absolute', top: '15%', left: '25%',
        width: 360, height: 360,
        background: 'rgba(99, 102, 241, 0.2)',
        borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none',
      }} />

      {/* Main Glass Card */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: 620,
        padding: '40px 36px',
        borderRadius: 24,
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.45)',
        color: '#f8fafc',
        textAlign: 'center',
      }}>
        <div style={{ textAlign: 'left', marginBottom: 20 }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              background: 'none', border: 'none', padding: 0,
              color: '#a5b4fc', fontSize: '0.9rem', fontWeight: 600,
              cursor: 'pointer',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
            onMouseLeave={e => e.currentTarget.style.color = '#a5b4fc'}
          >
            &larr; Back
          </button>
        </div>

        {/* Avatar */}
        <div style={{
          width: 72, height: 72, borderRadius: '50%', margin: '0 auto 16px',
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
          boxShadow: '0 0 25px rgba(99, 102, 241, 0.55)',
          border: '2px solid rgba(255, 255, 255, 0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, fontSize: '1.8rem', color: '#fff',
        }}>
          {profile.username?.charAt(0).toUpperCase()}
        </div>

        <h2 style={{
          margin: '0 0 6px 0',
          fontSize: '2rem',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #ffffff 40%, #c7d2fe 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          {profile.username}
        </h2>

        {profile.email && (
          <p style={{ margin: '0 0 24px 0', color: '#94a3b8', fontSize: '0.9rem' }}>
            {profile.email}
          </p>
        )}

        {/* Skills */}
        <div style={{
          padding: '24px', borderRadius: 18,
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          marginBottom: 24,
        }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 700, color: '#e2e8f0' }}>
            Skills & Interests
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {profile.skills?.length > 0 ? (
              profile.skills.map(skill => {
                const isTeach = skill.type === 'teach';
                return (
                  <span
                    key={skill.id}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '7px 16px', borderRadius: 999,
                      fontSize: '0.88rem', fontWeight: 600,
                      background: isTeach
                        ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.3) 100%)'
                        : 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.3) 100%)',
                      border: isTeach
                        ? '1px solid rgba(52, 211, 153, 0.45)'
                        : '1px solid rgba(251, 191, 36, 0.45)',
                      color: isTeach ? '#6ee7b7' : '#fde047',
                      boxShadow: isTeach
                        ? '0 0 14px rgba(16, 185, 129, 0.25)'
                        : '0 0 14px rgba(245, 158, 11, 0.25)',
                    }}
                  >
                    <span>{skill.name}</span>
                    <span style={{ fontSize: '0.72rem', opacity: 0.85, textTransform: 'uppercase' }}>
                      ({isTeach ? 'Teach' : 'Learn'})
                    </span>
                  </span>
                );
              })
            ) : (
              <p style={{ color: '#94a3b8', fontStyle: 'italic', margin: 0, fontSize: '0.9rem' }}>
                This user has not listed any skills yet.
              </p>
            )}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() =>
            window.dispatchEvent(
              new CustomEvent('open-chat', { detail: { id: profile.id, username: profile.username } })
            )
          }
          style={{
            padding: '12px 28px',
            borderRadius: 12,
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            color: '#ffffff',
            fontSize: '0.95rem',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.45)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(99, 102, 241, 0.65)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(99, 102, 241, 0.45)';
          }}
        >
          <span>💬</span> Chat with {profile.username}
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
