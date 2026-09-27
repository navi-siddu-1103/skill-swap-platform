import React, { useContext, useEffect, useState } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MySwaps = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    api.get(`/swaps/pending/${user.userId}`)
      .then(res => setIncoming(res.data))
      .catch(() => setError('Failed to load incoming requests'));
    api.get(`/swaps/sent/${user.userId}`)
      .then(res => setOutgoing(res.data))
      .catch(() => setError('Failed to load outgoing requests'));
  }, [user]);

  const handleRespond = async (swapId, status) => {
    try {
      await api.patch(`/swaps/status/${swapId}?status=${status}`);
      setIncoming(incoming.filter(req => req.id !== swapId));
    } catch {
      setError('Failed to update request status');
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || '').toUpperCase();
    const badges = {
      ACCEPTED: { bg: 'rgba(16,185,129,0.2)', border: 'rgba(52,211,153,0.45)', color: '#6ee7b7' },
      REJECTED: { bg: 'rgba(239,68,68,0.2)',  border: 'rgba(248,113,113,0.45)', color: '#fca5a5' },
    };
    const style = badges[s] || { bg: 'rgba(245,158,11,0.2)', border: 'rgba(251,191,36,0.45)', color: '#fde047' };
    return (
      <span style={{
        padding: '4px 12px', borderRadius: 999,
        background: style.bg, border: `1px solid ${style.border}`,
        color: style.color, fontSize: '0.78rem', fontWeight: 700,
        whiteSpace: 'nowrap',
      }}>
        {s || 'PENDING'}
      </span>
    );
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 60px)',
      padding: 'clamp(20px, 4vw, 40px) clamp(12px, 4vw, 24px) 60px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
    }}>
      {/* Background Glow */}
      <div style={{
        position: 'absolute', top: '15%', left: '20%',
        width: 'clamp(150px, 28vw, 360px)', height: 'clamp(150px, 28vw, 360px)',
        background: 'rgba(99, 102, 241, 0.2)',
        borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none',
      }} />

      {/* Main Glass Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: 820,
        padding: 'clamp(22px, 4vw, 36px) clamp(16px, 4vw, 32px)',
        borderRadius: 'clamp(16px, 3vw, 24px)',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.45)',
        color: '#f8fafc',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 24, flexWrap: 'wrap', gap: 12,
        }}>
          <h2 style={{
            margin: 0,
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            fontWeight: 800,
            letterSpacing: '-0.5px',
            background: 'linear-gradient(135deg, #ffffff 40%, #c7d2fe 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            My Skill Swaps
          </h2>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            style={{
              background: 'none', border: 'none', padding: 0,
              color: '#a5b4fc', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
              minHeight: 44, display: 'flex', alignItems: 'center',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
            onMouseLeave={e => e.currentTarget.style.color = '#a5b4fc'}
          >
            ← Back to Dashboard
          </button>
        </div>

        {error && (
          <div style={{
            padding: '11px 16px', borderRadius: 10,
            background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.35)',
            color: '#fca5a5', fontSize: '0.88rem', marginBottom: 20,
          }}>
            {error}
          </div>
        )}

        {/* Incoming */}
        <h3 style={{
          margin: '0 0 14px 0', fontSize: 'clamp(1rem, 3vw, 1.25rem)',
          fontWeight: 700, color: '#e2e8f0',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span>📥</span> Incoming Swap Requests
        </h3>

        {incoming.length === 0 ? (
          <div style={{
            padding: '18px 20px', borderRadius: 14,
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
            color: '#94a3b8', fontSize: '0.9rem', marginBottom: 32,
          }}>
            You have no pending incoming swap requests.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 32 }}>
            {incoming.map(req => (
              <div
                key={req.id}
                style={{
                  padding: 'clamp(14px, 3vw, 20px) clamp(14px, 3vw, 24px)',
                  borderRadius: 18,
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                }}
              >
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                  flexWrap: 'wrap', gap: 14,
                }}>
                  <div style={{ flex: '1 1 200px', minWidth: 0 }}>
                    <div style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)', fontWeight: 700, color: '#f8fafc', marginBottom: 6 }}>
                      From: <span style={{ color: '#818cf8' }}>{req.sender?.username || 'Unknown'}</span>
                    </div>
                    <div style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.7 }}>
                      <div>Skill Wanted: <strong style={{ color: '#fde047' }}>{req.desiredSkill}</strong></div>
                      <div>Skill Offered: <strong style={{ color: '#6ee7b7' }}>{req.requestedSkill}</strong></div>
                      <div>Contact: <span style={{ color: '#94a3b8' }}>{req.phoneNumber || 'N/A'}</span></div>
                      <div>Time: <span style={{ color: '#94a3b8' }}>{new Date(req.proposedDateTime).toLocaleString()}</span></div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignSelf: 'flex-end' }}>
                    <button
                      onClick={() => handleRespond(req.id, 'ACCEPTED')}
                      style={{
                        flex: '1 1 80px',
                        padding: '9px 18px', borderRadius: 10,
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        border: 'none', color: '#fff', fontSize: '0.9rem', fontWeight: 700,
                        cursor: 'pointer', boxShadow: '0 4px 12px rgba(16,185,129,0.4)',
                        transition: 'all 0.2s', minHeight: 44,
                      }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                    >
                      ✓ Accept
                    </button>
                    <button
                      onClick={() => handleRespond(req.id, 'REJECTED')}
                      style={{
                        flex: '1 1 80px',
                        padding: '9px 18px', borderRadius: 10,
                        background: 'rgba(239,68,68,0.15)',
                        border: '1px solid rgba(239,68,68,0.35)',
                        color: '#fca5a5', fontSize: '0.9rem', fontWeight: 600,
                        cursor: 'pointer', transition: 'all 0.2s', minHeight: 44,
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.25)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
                    >
                      ✗ Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Outgoing */}
        <h3 style={{
          margin: '0 0 14px 0', fontSize: 'clamp(1rem, 3vw, 1.25rem)',
          fontWeight: 700, color: '#e2e8f0',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span>📤</span> Outgoing Swap Requests
        </h3>

        {outgoing.length === 0 ? (
          <div style={{
            padding: '18px 20px', borderRadius: 14,
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
            color: '#94a3b8', fontSize: '0.9rem',
          }}>
            You have not sent any swap requests yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {outgoing.map(req => (
              <div
                key={req.id}
                style={{
                  padding: 'clamp(14px, 3vw, 20px) clamp(14px, 3vw, 24px)',
                  borderRadius: 18,
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', flexWrap: 'wrap', gap: 14,
                }}
              >
                <div style={{ flex: '1 1 200px', minWidth: 0 }}>
                  <div style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)', fontWeight: 700, color: '#f8fafc', marginBottom: 6 }}>
                    To: <span style={{ color: '#818cf8' }}>{req.recipient?.username || 'Unknown'}</span>
                  </div>
                  <div style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.7 }}>
                    <div>Skill Offered: <strong style={{ color: '#6ee7b7' }}>{req.requestedSkill}</strong></div>
                    <div>Skill Wanted: <strong style={{ color: '#fde047' }}>{req.desiredSkill}</strong></div>
                    <div>Contact: <span style={{ color: '#94a3b8' }}>{req.phoneNumber || 'N/A'}</span></div>
                    <div>Time: <span style={{ color: '#94a3b8' }}>{new Date(req.proposedDateTime).toLocaleString()}</span></div>
                  </div>
                </div>
                <div>{getStatusBadge(req.status)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MySwaps;
