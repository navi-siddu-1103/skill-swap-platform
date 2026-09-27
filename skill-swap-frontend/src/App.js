import React, { useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import ChatWindow from './components/ChatWindow';
import SplashScreen from './components/SplashScreen';
import api from './api/axios';

import Register    from './pages/Register';
import Login       from './pages/Login';
import Dashboard   from './pages/Dashboard';
import Profile     from './pages/Profile';
import SkillSearch from './pages/SkillSearch';
import MySwaps     from './pages/MySwaps';
import UserProfile from './pages/UserProfile';

// ── Private route guard ────────────────────────────────────────────────────
const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" replace />;
};

// ── Inbox Popup (Themed to match Splash Screen) ────────────────────────────
const InboxPopup = ({ conversations, loading, onSelectConv, onClose }) => {
  const ref = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <div ref={ref} style={{
      position: 'absolute', top: 50, right: 0,
      width: 320, maxHeight: 400, overflowY: 'auto',
      background: 'rgba(23, 23, 56, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: 16,
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6), 0 0 25px rgba(99, 102, 241, 0.25)',
      border: '1px solid rgba(255, 255, 255, 0.14)',
      zIndex: 9998,
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 18px 12px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        fontWeight: 700, fontSize: '0.95rem',
        color: '#c7d2fe',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>💬</span> Messages
        </span>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#94a3b8', lineHeight: 1 }}
        >×</button>
      </div>

      {/* Body */}
      {loading && (
        <div style={{ padding: '28px', textAlign: 'center', color: '#94a3b8', fontSize: '0.88rem' }}>
          Loading conversations…
        </div>
      )}
      {!loading && conversations.length === 0 && (
        <div style={{ padding: '32px 18px', textAlign: 'center', color: '#94a3b8', fontSize: '0.88rem' }}>
          No messages yet.<br/>
          <span style={{ color: '#818cf8', fontWeight: 600 }}>Find Partners</span> to start learning together!
        </div>
      )}
      {!loading && conversations.map(conv => (
        <button
          key={conv.userId}
          onClick={() => { onSelectConv(conv); onClose(); }}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 16px', border: 'none',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            background: conv.unreadCount > 0 ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
            cursor: 'pointer', textAlign: 'left',
            transition: 'background 0.15s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.25)'}
          onMouseLeave={e => e.currentTarget.style.background = conv.unreadCount > 0 ? 'rgba(99, 102, 241, 0.15)' : 'transparent'}
        >
          {/* Avatar with gradient */}
          <div style={{
            width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            boxShadow: '0 0 12px rgba(99, 102, 241, 0.4)',
            color: '#fff', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontWeight: 700, fontSize: '1rem',
          }}>
            {conv.username.charAt(0).toUpperCase()}
          </div>
          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: conv.unreadCount > 0 ? 700 : 500, fontSize: '0.92rem', color: '#f8fafc' }}>
              {conv.username}
            </div>
            <div style={{
              fontSize: '0.78rem', color: '#94a3b8',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              fontWeight: conv.unreadCount > 0 ? 600 : 400,
            }}>
              {conv.lastMessage || 'Say hello!'}
            </div>
          </div>
          {/* Unread badge */}
          {conv.unreadCount > 0 && (
            <div style={{
              background: '#ef4444', color: '#fff',
              borderRadius: '50%', minWidth: 20, height: 20,
              fontSize: '0.7rem', fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '0 4px', flexShrink: 0,
              boxShadow: '0 0 8px rgba(239, 68, 68, 0.5)',
            }}>
              {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

// ── Navbar (Themed to match Splash Screen) ──────────────────────────────────
const Navbar = ({ unreadCount, onOpenChat, onUnreadChange }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate         = useNavigate();
  const location         = useLocation();
  const [showInbox, setShowInbox]         = useState(false);
  const [conversations, setConversations] = useState([]);
  const [loadingConvs, setLoadingConvs]   = useState(false);

  const noNavPaths = ['/login', '/register'];
  if (noNavPaths.includes(location.pathname)) return null;
  if (!user) return null;

  const handleLogout = () => { logout(); navigate('/login'); };

  const toggleInbox = async () => {
    if (showInbox) { setShowInbox(false); return; }
    setShowInbox(true);
    setLoadingConvs(true);
    try {
      const res = await api.get(`/chat/conversations/${user.userId}`);
      setConversations(res.data);
    } catch { setConversations([]); }
    finally { setLoadingConvs(false); }
  };

  const handleSelectConv = (conv) => {
    onOpenChat({ id: conv.userId, username: conv.username });
    setTimeout(() => { if (onUnreadChange) onUnreadChange(); }, 500);
  };

  return (
    <nav style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '0 32px', height: 64,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      color: '#fff', position: 'sticky', top: 0, zIndex: 30,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)',
    }}>
      {/* Brand with glowing exchange icon */}
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
        onClick={() => navigate('/dashboard')}
      >
        <div style={{
          width: 34, height: 34, borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 16px rgba(99, 102, 241, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 3h5v5" />
            <path d="M4 20L21 3" />
            <path d="M21 16v5h-5" />
            <path d="M15 15l6 6" />
            <path d="M4 4l5 5" />
          </svg>
        </div>
        <span style={{
          fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.5px',
          background: 'linear-gradient(135deg, #ffffff 40%, #c7d2fe 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          Skill Swap
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        {[
          { to: '/dashboard', label: 'Dashboard' },
          { to: '/profile',   label: 'My Profile' },
          { to: '/search',    label: 'Find Partners' },
          { to: '/swaps',     label: 'My Swaps' },
        ].map(({ to, label }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to} to={to}
              style={{
                color: isActive ? '#ffffff' : '#cbd5e1',
                textDecoration: 'none',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.93rem',
                padding: '6px 14px',
                borderRadius: 10,
                background: isActive ? 'rgba(99, 102, 241, 0.22)' : 'transparent',
                border: isActive ? '1px solid rgba(99, 102, 241, 0.45)' : '1px solid transparent',
                boxShadow: isActive ? '0 0 14px rgba(99, 102, 241, 0.25)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              {label}
            </Link>
          );
        })}

        {/* 💬 Chat icon with badge & inbox */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={toggleInbox}
            title="Messages"
            style={{
              position: 'relative',
              background: showInbox ? 'rgba(99, 102, 241, 0.35)' : 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '50%', width: 40, height: 40,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
              boxShadow: showInbox ? '0 0 15px rgba(99, 102, 241, 0.4)' : 'none',
            }}
          >
            <svg width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: -3, right: -3,
                background: '#ef4444', color: '#fff', borderRadius: '50%',
                width: 19, height: 19, fontSize: '0.68rem', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid #0f172a',
                boxShadow: '0 0 10px rgba(239, 68, 68, 0.6)',
              }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Inbox dropdown */}
          {showInbox && (
            <InboxPopup
              conversations={conversations}
              loading={loadingConvs}
              onSelectConv={handleSelectConv}
              onClose={() => setShowInbox(false)}
            />
          )}
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            color: '#fca5a5',
            padding: '7px 18px', borderRadius: 9, fontWeight: 600,
            cursor: 'pointer', fontSize: '0.88rem',
            transition: 'all 0.2s',
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
    </nav>
  );
};

// ── App root ───────────────────────────────────────────────────────────────
function App() {
  const { user } = useContext(AuthContext);
  const [chatPartner, setChatPartner] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showSplash, setShowSplash] = useState(true);

  const refreshUnread = useCallback(() => {
    if (!user) return;
    api.get(`/chat/unread/count/${user.userId}`)
      .then(res => setUnreadCount(res.data.count ?? 0))
      .catch(() => {});
  }, [user]);

  // Poll unread count every 10 s
  useEffect(() => {
    refreshUnread();
    const id = setInterval(refreshUnread, 10_000);
    return () => clearInterval(id);
  }, [refreshUnread]);

  // Allow child pages to open chat via custom DOM event (no prop drilling)
  useEffect(() => {
    const handler = e => setChatPartner(e.detail);
    window.addEventListener('open-chat', handler);
    return () => window.removeEventListener('open-chat', handler);
  }, []);

  const openChat = (partner) => setChatPartner(partner);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      <Navbar
        unreadCount={unreadCount}
        onOpenChat={openChat}
        onUnreadChange={refreshUnread}
      />

      <div style={{ flex: 1 }}>
        <Routes>
          {/* Public */}
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" replace />} />
          <Route path="/login"    element={!user ? <Login />    : <Navigate to="/dashboard" replace />} />

          {/* Protected */}
          <Route path="/dashboard"   element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/profile"     element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/profile/:id" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
          <Route path="/search"      element={<PrivateRoute><SkillSearch /></PrivateRoute>} />
          <Route path="/swaps"       element={<PrivateRoute><MySwaps /></PrivateRoute>} />

          {/* Catch-all */}
          <Route path="*" element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
        </Routes>
      </div>

      {/* Floating chat window — persists across page navigation */}
      {chatPartner && (
        <ChatWindow
          partner={chatPartner}
          onClose={() => { setChatPartner(null); refreshUnread(); }}
          onUnreadChange={refreshUnread}
        />
      )}
    </div>
  );
}

export default App;
