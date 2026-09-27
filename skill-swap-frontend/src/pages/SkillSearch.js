import React, { useState, useEffect, useContext, useCallback } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const initialRequest = {
  skillToGive: '',
  skillToGet: '',
  dateTime: '',
  phoneNumber: '',
};

const SkillSearch = () => {
  const { user } = useContext(AuthContext);
  const [search, setSearch] = useState({ skill: '', type: 'all' });
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [searching, setSearching] = useState(false);
  const [mySkills, setMySkills] = useState([]);

  // Swap Request Modal state
  const [swapModal, setSwapModal] = useState(null);
  const [form, setForm] = useState(initialRequest);
  const [success, setSuccess] = useState('');
  const [sendingSwap, setSendingSwap] = useState(false);

  // Fetch current user's skills for easy modal pre-selection
  useEffect(() => {
    if (user?.userId) {
      api.get(`/skills/user/${user.userId}`)
        .then(res => setMySkills(res.data || []))
        .catch(() => {});
    }
  }, [user?.userId]);

  // Load all community partners initially on page load
  const loadPartners = useCallback(async (skillQuery = '', typeQuery = 'all') => {
    setSearching(true);
    setError('');
    try {
      const res = await api.get('/search', {
        params: {
          skill: skillQuery,
          type: typeQuery,
        },
      });
      // Filter out self
      const filtered = (res.data || []).filter(u => Number(u.id) !== Number(user?.userId));
      setResults(filtered);
      if (filtered.length === 0) {
        if (skillQuery) {
          setError(`No partners found matching "${skillQuery}". Try searching another skill or browse all partners!`);
        }
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err?.response?.data?.message || 'Could not load partners. Please try again.');
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, [user?.userId]);

  useEffect(() => {
    loadPartners('', 'all');
  }, [loadPartners]);

  const handleChange = (e) =>
    setSearch({ ...search, [e.target.name]: e.target.value });

  const handleSearch = (e) => {
    e.preventDefault();
    loadPartners(search.skill.trim(), search.type);
  };

  const handleBrowseAll = () => {
    setSearch({ skill: '', type: 'all' });
    loadPartners('', 'all');
  };

  const openSwap = (recipient) => {
    setSwapModal(recipient);
    // Pre-fill suggested skills if available
    const defaultToGet = recipient.teachSkills && recipient.teachSkills.length > 0 ? recipient.teachSkills[0] : '';
    const myTeachSkills = mySkills.filter(s => s.type === 'teach');
    const defaultToGive = myTeachSkills.length > 0 ? myTeachSkills[0].name : '';

    setForm({
      skillToGive: defaultToGive,
      skillToGet: defaultToGet,
      dateTime: '',
      phoneNumber: '',
    });
    setError('');
    setSuccess('');
  };

  const handleFormChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmitSwap = async (e) => {
    e.preventDefault();
    if (
      !form.skillToGive ||
      !form.skillToGet ||
      !form.dateTime ||
      !form.phoneNumber
    ) {
      setError('All fields are required.');
      return;
    }

    setSendingSwap(true);
    setError('');
    try {
      await api.post('/swaps/request', {
        senderId: String(user.userId),
        recipientId: String(swapModal.id),
        requestedSkill: form.skillToGet,
        desiredSkill: form.skillToGive,
        proposedDateTime: form.dateTime,
        phoneNumber: form.phoneNumber,
      });
      setSuccess(`Swap request sent to ${swapModal.username} successfully!`);
      setSwapModal(null);
      setForm(initialRequest);
    } catch (err) {
      console.error('Swap request error:', err);
      setError(err?.response?.data?.message || 'Failed to send swap request.');
    } finally {
      setSendingSwap(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      padding: '40px 24px 60px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
    }}>
      {/* Background Glow Orbs */}
      <div style={{
        position: 'absolute', top: '15%', left: '20%',
        width: 380, height: 380,
        background: 'rgba(99, 102, 241, 0.22)',
        borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '15%', right: '20%',
        width: 360, height: 360,
        background: 'rgba(168, 85, 247, 0.18)',
        borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none',
      }} />

      {/* Main Glass Card */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: 820,
        padding: '36px 32px',
        borderRadius: 24,
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.45)',
        color: '#f8fafc',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h2 style={{
            margin: '0 0 6px 0',
            fontSize: '2.1rem',
            fontWeight: 800,
            letterSpacing: '-0.5px',
            background: 'linear-gradient(135deg, #ffffff 40%, #c7d2fe 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Explore Community & Find Partners
          </h2>
          <p style={{ margin: 0, fontSize: '0.92rem', color: '#94a3b8' }}>
            Search by skill, discover what peers can teach or learn, and propose a swap.
          </p>
        </div>

        {/* Search Bar Form */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
          <input
            name="skill"
            value={search.skill}
            onChange={handleChange}
            placeholder="Search skill (e.g. Java, Python, React, RAG)"
            style={{
              flex: '1 1 240px',
              padding: '12px 16px',
              borderRadius: 12,
              background: 'rgba(255, 255, 255, 0.07)',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              color: '#ffffff',
              fontSize: '0.95rem',
              outline: 'none',
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
            name="type"
            value={search.type}
            onChange={handleChange}
            style={{
              padding: '12px 14px',
              borderRadius: 12,
              background: '#1e1b4b',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              color: '#ffffff',
              fontSize: '0.95rem',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="all" style={{ background: '#1e1b4b', color: '#fff' }}>Any (Teach or Learn)</option>
            <option value="teach" style={{ background: '#1e1b4b', color: '#fff' }}>Partners who Can Teach</option>
            <option value="learn" style={{ background: '#1e1b4b', color: '#fff' }}>Partners who Want to Learn</option>
          </select>

          <button
            type="submit"
            disabled={searching}
            style={{
              padding: '12px 24px',
              borderRadius: 12,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: '#ffffff',
              fontSize: '0.95rem',
              fontWeight: 700,
              border: 'none',
              cursor: searching ? 'default' : 'pointer',
              boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              if (!searching) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(99, 102, 241, 0.6)';
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(99, 102, 241, 0.4)';
            }}
          >
            {searching ? 'Searching…' : 'Search'}
          </button>

          <button
            type="button"
            onClick={handleBrowseAll}
            style={{
              padding: '12px 18px',
              borderRadius: 12,
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              color: '#c7d2fe',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.14)';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.color = '#c7d2fe';
            }}
          >
            Browse All
          </button>
        </form>

        {/* Notifications */}
        {error && !swapModal && (
          <div style={{
            padding: '12px 16px', borderRadius: 12,
            background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.35)',
            color: '#fca5a5', fontSize: '0.9rem', textAlign: 'center', marginBottom: 20,
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            padding: '12px 16px', borderRadius: 12,
            background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.35)',
            color: '#6ee7b7', fontSize: '0.9rem', textAlign: 'center', marginBottom: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <span>🎉</span> {success}
          </div>
        )}

        {/* Results Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}>
          <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#c7d2fe' }}>
            Available Community Partners ({results.length})
          </span>
          {search.skill && (
            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Filtered by: <strong style={{ color: '#818cf8' }}>"{search.skill}"</strong>
            </span>
          )}
        </div>

        {results.length === 0 && !searching && !error && (
          <div style={{ textAlign: 'center', color: '#94a3b8', fontStyle: 'italic', padding: '36px 0', fontSize: '0.95rem' }}>
            No partners found matching this query.<br />
            <button
              onClick={handleBrowseAll}
              style={{
                marginTop: 10, background: 'none', border: 'none',
                color: '#818cf8', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline',
              }}
            >
              Click here to view all community members
            </button>
          </div>
        )}

        {/* Partner Cards Grid */}
        {results.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {results.map(u => (
              <div
                key={u.id}
                style={{
                  padding: '20px 22px',
                  borderRadius: 18,
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 4px 18px rgba(0, 0, 0, 0.25)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                }}
              >
                {/* Top Row: User info and Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    {/* Glowing Avatar */}
                    <div style={{
                      width: 48, height: 48, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: '1.2rem', color: '#fff',
                      boxShadow: '0 0 16px rgba(99, 102, 241, 0.5)',
                      border: '1.5px solid rgba(255, 255, 255, 0.25)',
                    }}>
                      {u.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1.15rem', color: '#ffffff' }}>
                        {u.username}
                      </div>
                      {u.email && (
                        <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                          {u.email}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      style={{
                        padding: '9px 16px',
                        borderRadius: 11,
                        background: 'rgba(99, 102, 241, 0.2)',
                        border: '1px solid rgba(99, 102, 241, 0.45)',
                        color: '#c7d2fe',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(99, 102, 241, 0.35)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)';
                        e.currentTarget.style.transform = 'none';
                      }}
                      onClick={() =>
                        window.dispatchEvent(
                          new CustomEvent('open-chat', { detail: { id: u.id, username: u.username } })
                        )
                      }
                      title={`Chat live with ${u.username}`}
                    >
                      💬 Chat
                    </button>

                    <button
                      style={{
                        padding: '9px 20px',
                        borderRadius: 11,
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        border: 'none',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(99, 102, 241, 0.6)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.boxShadow = '0 4px 14px rgba(99, 102, 241, 0.4)';
                      }}
                      onClick={() => openSwap(u)}
                    >
                      Send Swap Request
                    </button>
                  </div>
                </div>

                {/* Bottom Row: Skills pills */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 4 }}>
                  {/* Can Teach */}
                  {u.teachSkills && u.teachSkills.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6ee7b7', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Can Teach:
                      </span>
                      {u.teachSkills.map((sk, idx) => (
                        <span
                          key={idx}
                          style={{
                            padding: '3px 10px', borderRadius: 999,
                            background: 'rgba(16, 185, 129, 0.18)', border: '1px solid rgba(52, 211, 153, 0.4)',
                            color: '#6ee7b7', fontSize: '0.78rem', fontWeight: 600,
                          }}
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Wants to Learn */}
                  {u.learnSkills && u.learnSkills.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fde047', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Wants to Learn:
                      </span>
                      {u.learnSkills.map((sk, idx) => (
                        <span
                          key={idx}
                          style={{
                            padding: '3px 10px', borderRadius: 999,
                            background: 'rgba(245, 158, 11, 0.18)', border: '1px solid rgba(251, 191, 36, 0.4)',
                            color: '#fde047', fontSize: '0.78rem', fontWeight: 600,
                          }}
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Swap Request Modal ── */}
      {swapModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: 20,
        }}>
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: 480,
            padding: '36px 32px',
            borderRadius: 24,
            background: 'rgba(23, 23, 56, 0.96)',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6), 0 0 35px rgba(99, 102, 241, 0.3)',
            color: '#f8fafc',
          }}>
            <h3 style={{
              margin: '0 0 6px 0', fontSize: '1.45rem', fontWeight: 800,
              background: 'linear-gradient(135deg, #ffffff 40%, #c7d2fe 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Swap Skills with {swapModal.username}
            </h3>
            <p style={{ margin: '0 0 20px 0', fontSize: '0.85rem', color: '#94a3b8' }}>
              Propose a skill exchange and schedule a convenient meeting time.
            </p>

            <form onSubmit={handleSubmitSwap} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#c7d2fe', marginBottom: 5 }}>
                  Skill you want to learn from {swapModal.username}
                </label>
                <input
                  name="skillToGet"
                  value={form.skillToGet}
                  onChange={handleFormChange}
                  placeholder="e.g. Java, Spring Boot, UI/UX"
                  required
                  style={modalInputStyle}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#c7d2fe', marginBottom: 5 }}>
                  Skill you will teach {swapModal.username} in return
                </label>
                <input
                  name="skillToGive"
                  value={form.skillToGive}
                  onChange={handleFormChange}
                  placeholder="e.g. Python, React, English"
                  required
                  style={modalInputStyle}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#c7d2fe', marginBottom: 5 }}>
                  Your Phone / Contact Info
                </label>
                <input
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleFormChange}
                  placeholder="e.g. +91 98765 43210"
                  required
                  style={modalInputStyle}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#c7d2fe', marginBottom: 5 }}>
                  Proposed Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="dateTime"
                  value={form.dateTime}
                  onChange={handleFormChange}
                  required
                  style={{ ...modalInputStyle, colorScheme: 'dark' }}
                />
              </div>

              {error && (
                <div style={{
                  padding: '9px 12px', borderRadius: 8,
                  background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.35)',
                  color: '#fca5a5', fontSize: '0.82rem', textAlign: 'center',
                }}>
                  {error}
                </div>
              )}

              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button
                  type="submit"
                  disabled={sendingSwap}
                  style={{
                    flex: 1, padding: '12px', borderRadius: 12,
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    color: '#ffffff', fontSize: '0.95rem', fontWeight: 700,
                    border: 'none', cursor: sendingSwap ? 'default' : 'pointer',
                    boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
                    opacity: sendingSwap ? 0.7 : 1,
                  }}
                >
                  {sendingSwap ? 'Sending Request…' : 'Send Swap Request'}
                </button>
                <button
                  type="button"
                  onClick={() => setSwapModal(null)}
                  style={{
                    padding: '12px 20px', borderRadius: 12,
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    color: '#e2e8f0', fontSize: '0.95rem', fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const modalInputStyle = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 10,
  background: 'rgba(255, 255, 255, 0.07)',
  border: '1px solid rgba(255, 255, 255, 0.16)',
  color: '#ffffff',
  fontSize: '0.92rem',
  outline: 'none',
  boxSizing: 'border-box',
};

export default SkillSearch;
