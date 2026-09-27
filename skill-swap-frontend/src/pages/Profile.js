import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({ name: '', type: 'teach' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api.get(`/skills/user/${user.userId}`)
      .then(res => setSkills(res.data))
      .catch(() => setSkills([]))
      .finally(() => setLoading(false));
  }, [user.userId]);

  const handleSkillAdd = async (e) => {
    e.preventDefault();
    setError('');
    if (!newSkill.name.trim()) { setError('Skill name is required'); return; }
    setLoading(true);
    try {
      const res = await api.post('/skills/add', {
        userId: user.userId,
        name: newSkill.name.trim(),
        type: newSkill.type,
      });
      setSkills(prev => [...prev, res.data]);
      setNewSkill({ name: '', type: 'teach' });
    } catch {
      setError('Failed to add skill. Try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 60px)',
      padding: 'clamp(20px, 4vw, 40px) clamp(12px, 4vw, 24px) 60px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      position: 'relative',
    }}>
      {/* Background Glow */}
      <div style={{
        position: 'absolute', top: '15%', left: '25%',
        width: 'clamp(150px, 28vw, 360px)', height: 'clamp(150px, 28vw, 360px)',
        background: 'rgba(99, 102, 241, 0.2)',
        borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none',
      }} />

      {/* Main Glass Card */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: 720,
        padding: 'clamp(22px, 5vw, 40px) clamp(16px, 4vw, 36px)',
        borderRadius: 'clamp(16px, 3vw, 24px)',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.45)',
        color: '#f8fafc',
      }}>
        {/* User Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 28,
          paddingBottom: 20,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          flexWrap: 'wrap',
          gap: 14,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Avatar */}
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              boxShadow: '0 0 18px rgba(99, 102, 241, 0.5)',
              border: '2px solid rgba(255, 255, 255, 0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: '1.3rem', color: '#fff',
              flexShrink: 0,
            }}>
              {user.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={{
                margin: '0 0 4px 0',
                fontSize: 'clamp(1.3rem, 4vw, 1.8rem)',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #ffffff 40%, #c7d2fe 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                {user.username}
              </h2>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                Role: <span style={{ color: '#818cf8', fontWeight: 600 }}>{user.role || 'Member'}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => { logout(); navigate('/login'); }}
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              color: '#fca5a5',
              padding: '9px 18px',
              borderRadius: 10,
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              minHeight: 44,
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)';
              e.currentTarget.style.boxShadow = '0 0 12px rgba(239, 68, 68, 0.4)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Logout
          </button>
        </div>

        {/* Skills Section */}
        <h3 style={{
          margin: '0 0 14px 0', fontSize: 'clamp(1rem, 3vw, 1.25rem)',
          fontWeight: 700, color: '#e2e8f0',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span>⚡</span> My Skills
        </h3>

        {loading ? (
          <p style={{ color: '#818cf8', fontSize: '0.9rem', marginBottom: 20 }}>Loading skills…</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
            {skills.length > 0 ? (
              skills.map(skill => {
                const isTeach = skill.type === 'teach';
                return (
                  <span
                    key={skill.id}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      padding: '7px 14px', borderRadius: 999,
                      fontSize: 'clamp(0.78rem, 2vw, 0.88rem)', fontWeight: 600,
                      background: isTeach
                        ? 'linear-gradient(135deg, rgba(16,185,129,0.2) 0%, rgba(5,150,105,0.3) 100%)'
                        : 'linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(217,119,6,0.3) 100%)',
                      border: isTeach
                        ? '1px solid rgba(52,211,153,0.45)'
                        : '1px solid rgba(251,191,36,0.45)',
                      color: isTeach ? '#6ee7b7' : '#fde047',
                      boxShadow: isTeach
                        ? '0 0 12px rgba(16,185,129,0.2)'
                        : '0 0 12px rgba(245,158,11,0.2)',
                      transition: 'transform 0.15s ease',
                      cursor: 'default',
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <span>{skill.name}</span>
                    <span style={{ fontSize: '0.7rem', opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      ({isTeach ? 'Teach' : 'Learn'})
                    </span>
                  </span>
                );
              })
            ) : (
              <p style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.9rem', margin: '0 0 8px 0' }}>
                You haven't listed any skills yet. Add some below!
              </p>
            )}
          </div>
        )}

        {/* Add Skill Form */}
        <div style={{
          padding: 'clamp(16px, 3vw, 24px)',
          borderRadius: 18,
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.09)',
          marginBottom: 24,
        }}>
          <h4 style={{ margin: '0 0 14px 0', fontSize: '0.95rem', fontWeight: 600, color: '#c7d2fe' }}>
            Add a New Skill
          </h4>
          <form onSubmit={handleSkillAdd} style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="e.g. Python, React, UI/UX"
              value={newSkill.name}
              onChange={e => setNewSkill({ ...newSkill, name: e.target.value })}
              disabled={loading}
              required
              style={{
                flex: '1 1 140px',
                padding: '11px 16px',
                borderRadius: 12,
                background: 'rgba(255, 255, 255, 0.07)',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                color: '#ffffff',
                fontSize: '1rem',
                outline: 'none',
                minHeight: 46,
              }}
              onFocus={e => {
                e.target.style.borderColor = '#818cf8';
                e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.35)';
              }}
              onBlur={e => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.16)';
                e.target.style.boxShadow = 'none';
              }}
            />
            <select
              value={newSkill.type}
              onChange={e => setNewSkill({ ...newSkill, type: e.target.value })}
              disabled={loading}
              style={{
                padding: '11px 14px',
                borderRadius: 12,
                background: '#1e1b4b',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                color: '#ffffff',
                fontSize: '1rem',
                outline: 'none',
                cursor: 'pointer',
                minHeight: 46,
              }}
            >
              <option value="teach" style={{ background: '#1e1b4b', color: '#fff' }}>Can Teach</option>
              <option value="learn" style={{ background: '#1e1b4b', color: '#fff' }}>Want to Learn</option>
            </select>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: '1 1 100px',
                padding: '11px 20px',
                borderRadius: 12,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: '#ffffff',
                fontSize: '0.95rem',
                fontWeight: 700,
                border: 'none',
                cursor: loading ? 'default' : 'pointer',
                boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
                transition: 'all 0.2s',
                minHeight: 46,
              }}
              onMouseEnter={e => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(99, 102, 241, 0.6)';
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(99, 102, 241, 0.4)';
              }}
            >
              + Add
            </button>
          </form>
          {error && <p style={{ margin: '10px 0 0 0', color: '#fca5a5', fontSize: '0.85rem' }}>{error}</p>}
        </div>

        {/* Back button */}
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          style={{
            background: 'none', border: 'none', padding: 0,
            color: '#a5b4fc', fontSize: '0.92rem', fontWeight: 600,
            cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
            minHeight: 44,
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
          onMouseLeave={e => e.currentTarget.style.color = '#a5b4fc'}
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Profile;
