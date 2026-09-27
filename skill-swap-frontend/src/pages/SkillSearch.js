import React, { useState, useContext } from 'react';
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
  const [search, setSearch] = useState({ skill: '', type: 'teach' });
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [searching, setSearching] = useState(false);

  // Swap Request Modal state
  const [swapModal, setSwapModal] = useState(null);
  const [form, setForm] = useState(initialRequest);
  const [success, setSuccess] = useState('');

  const handleChange = (e) =>
    setSearch({ ...search, [e.target.name]: e.target.value });

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!search.skill.trim()) {
      setError('Please enter a skill to search.');
      return;
    }
    setSearching(true);
    try {
      const res = await api.get('/search', { params: search });
      const filtered = (res.data || []).filter(u => Number(u.id) !== Number(user?.userId));
      setResults(filtered);
      setError('');
    } catch (err) {
      console.error('Search error:', err);
      setError(err?.response?.data?.message || 'Search failed. Please try again.');
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const openSwap = (recipient) => {
    setSwapModal(recipient);
    setForm(initialRequest);
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

    try {
      await api.post('/swaps/request', {
        senderId: user.userId,
        recipientId: swapModal.id,
        requestedSkill: form.skillToGet,
        desiredSkill: form.skillToGive,
        proposedDateTime: form.dateTime,
        phoneNumber: form.phoneNumber,
      });
      setSuccess('Swap request sent successfully!');
      setSwapModal(null);
      setForm(initialRequest);
    } catch (err) {
      console.error('Swap request error:', err);
      setError('Failed to send swap request.');
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
      {/* Background Glow */}
      <div style={{
        position: 'absolute', top: '15%', left: '20%',
        width: 360, height: 360,
        background: 'rgba(99, 102, 241, 0.2)',
        borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none',
      }} />

      {/* Main Glass Card */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: 720,
        padding: '36px 32px',
        borderRadius: 24,
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.45)',
        color: '#f8fafc',
      }}>
        <h2 style={{
          margin: '0 0 24px 0',
          fontSize: '2rem',
          fontWeight: 800,
          letterSpacing: '-0.5px',
          background: 'linear-gradient(135deg, #ffffff 40%, #c7d2fe 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textAlign: 'center',
        }}>
          Find Skill Swap Partners
        </h2>

        {/* Search Bar Form */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
          <input
            name="skill"
            value={search.skill}
            onChange={handleChange}
            placeholder="Search skill (e.g. Python, Java, React)"
            style={{
              flex: '1 1 220px',
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
            <option value="teach" style={{ background: '#1e1b4b', color: '#fff' }}>Can Teach</option>
            <option value="learn" style={{ background: '#1e1b4b', color: '#fff' }}>Want To Learn</option>
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
        </form>

        {error && !swapModal && (
          <div style={{
            padding: '11px 14px', borderRadius: 10,
            background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.35)',
            color: '#fca5a5', fontSize: '0.88rem', textAlign: 'center', marginBottom: 18,
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            padding: '11px 14px', borderRadius: 10,
            background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.35)',
            color: '#6ee7b7', fontSize: '0.88rem', textAlign: 'center', marginBottom: 18,
          }}>
            {success}
          </div>
        )}

        {results.length === 0 && !searching && !error && (
          <div style={{ textAlign: 'center', color: '#94a3b8', fontStyle: 'italic', padding: '24px 0', fontSize: '0.92rem' }}>
            No partners found matching this skill yet. Try another search or filter!
          </div>
        )}

        {/* Results List */}
        {results.length > 0 && (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {results.map(u => (
              <li
                key={u.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  borderRadius: 16,
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.2s ease',
                  flexWrap: 'wrap',
                  gap: 12,
                }}
              >
                {/* User Info with Avatar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '1rem', color: '#fff',
                    boxShadow: '0 0 12px rgba(99, 102, 241, 0.45)',
                  }}>
                    {u.username?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: '#f8fafc' }}>
                      {u.username}
                    </div>
                    {u.email && (
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                        {u.email}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    style={{
                      padding: '8px 16px',
                      borderRadius: 10,
                      background: 'rgba(99, 102, 241, 0.2)',
                      border: '1px solid rgba(99, 102, 241, 0.45)',
                      color: '#c7d2fe',
                      fontSize: '0.88rem',
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
                    title={`Chat with ${u.username}`}
                  >
                    💬 Chat
                  </button>

                  <button
                    style={{
                      padding: '8px 18px',
                      borderRadius: 10,
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                      border: 'none',
                      color: '#ffffff',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 6px 18px rgba(99, 102, 241, 0.55)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.35)';
                    }}
                    onClick={() => openSwap(u)}
                  >
                    Send Swap Request
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ── Swap Request Modal (Themed Glassmorphism) ── */}
      {swapModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.65)',
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
            background: 'rgba(23, 23, 56, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6), 0 0 30px rgba(99, 102, 241, 0.3)',
            color: '#f8fafc',
          }}>
            <h3 style={{
              margin: '0 0 8px 0', fontSize: '1.4rem', fontWeight: 800,
              background: 'linear-gradient(135deg, #ffffff 40%, #c7d2fe 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Swap Request with {swapModal.username}
            </h3>
            <p style={{ margin: '0 0 20px 0', fontSize: '0.85rem', color: '#94a3b8' }}>
              Propose a skill trade and schedule a convenient exchange time.
            </p>

            <form onSubmit={handleSubmitSwap} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#c7d2fe', marginBottom: 5 }}>
                  Skill you will teach / give
                </label>
                <input
                  name="skillToGive"
                  value={form.skillToGive}
                  onChange={handleFormChange}
                  placeholder="e.g. Python, React"
                  required
                  style={modalInputStyle}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#c7d2fe', marginBottom: 5 }}>
                  Skill you want to learn from {swapModal.username}
                </label>
                <input
                  name="skillToGet"
                  value={form.skillToGet}
                  onChange={handleFormChange}
                  placeholder="e.g. Java, Docker"
                  required
                  style={modalInputStyle}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#c7d2fe', marginBottom: 5 }}>
                  Phone / Contact info
                </label>
                <input
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleFormChange}
                  placeholder="e.g. +1 234 567 8900"
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

              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button
                  type="submit"
                  style={{
                    flex: 1, padding: '12px', borderRadius: 12,
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    color: '#ffffff', fontSize: '0.95rem', fontWeight: 700,
                    border: 'none', cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
                  }}
                >
                  Send Request
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
