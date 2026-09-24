import React, { useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import ChatWindow from './components/ChatWindow';
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

// ── Inbox Popup ─────────────────────────────────────────────────────────────
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
      position: 'absolute', top: 48, right: 0,
      width: 300, maxHeight: 380, overflowY: 'auto',
      background: '#fff', borderRadius: 12,
      boxShadow: '0 8px 32px rgba(67,56,202,0.18)',
      border: '1px solid #e8e8f5', zIndex: 9998,
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px 10px', borderBottom: '1px solid #f0f0fa',
        fontWeight: 700, fontSize: '0.95rem', color: '#3730a3',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span>💬 Messages</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: '#999' }}>×</button>
      </div>

      {/* Body */}
      {loading && (
        <div style={{ padding: '24px', textAlign: 'center', color: '#aaa', fontSize: '0.85rem' }}>
          Loading conversations…
        </div>
      )}
      {!loading && conversations.length === 0 && (
        <div style={{ padding: '28px 16px', textAlign: 'center', color: '#aaa', fontSize: '0.85rem' }}>
          No messages yet.<br/>
          <span style={{ color: '#6366f1' }}>Find Partners</span> and start chatting!
        </div>
      )}
      {!loading && conversations.map(conv => (
        <button
          key={conv.userId}
          onClick={() => { onSelectConv(conv); onClose(); }}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 16px', border: 'none', borderBottom: '1px solid #f5f5fc',
            background: conv.unreadCount > 0 ? '#f5f3ff' : '#fff',
            cursor: 'pointer', textAlign: 'left',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#eef2ff'}
          onMouseLeave={e => e.currentTarget.style.background = conv.unreadCount > 0 ? '#f5f3ff' : '#fff'}
        >
          {/* Avatar */}
          <div style={{
            width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg,#4338ca,#6366f1)',
            color: '#fff', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontWeight: 700, fontSize: '1rem',
          }}>
            {conv.username.charAt(0).toUpperCase()}
          </div>
          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: conv.unreadCount > 0 ? 700 : 500, fontSize: '0.9rem', color: '#1f2937' }}>
              {conv.username}
            </div>
            <div style={{
              fontSize: '0.78rem', color: '#6b7280',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              fontWeight: conv.unreadCount > 0 ? 600 : 400,
            }}>
              {conv.lastMessage || 'Say hello!'}
            </div>
          </div>
          {/* Unread badge */}
          {conv.unreadCount > 0 && (
            <div style={{
              background: '#4338ca', color: '#fff',
              borderRadius: '50%', minWidth: 20, height: 20,
              fontSize: '0.7rem', fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '0 4px', flexShrink: 0,
            }}>
              {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

// ── Navbar ─────────────────────────────────────────────────────────────────
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
    // After opening, refresh unread count
    setTimeout(() => { if (onUnreadChange) onUnreadChange(); }, 500);
  };

  return (
    <nav style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '0 32px', height: 60,
      background: 'linear-gradient(90deg,#3730a3,#4f46e5)',
      color: '#fff', position: 'sticky', top: 0, zIndex: 30,
      boxShadow: '0 2px 10px rgba(60,50,180,0.18)',
    }}>
      <div
        style={{ fontWeight: 800, fontSize: '1.25rem', cursor: 'pointer', letterSpacing: '-0.5px' }}
        onClick={() => navigate('/dashboard')}
      >
        Skill Swap
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        {[
          { to: '/dashboard', label: 'Dashboard' },
          { to: '/profile',   label: 'My Profile' },
          { to: '/search',    label: 'Find Partners' },
          { to: '/swaps',     label: 'My Swaps' },
        ].map(({ to, label }) => (
          <Link
            key={to} to={to}
            style={{ color: '#fff', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem',
                     opacity: location.pathname === to ? 1 : 0.82 }}
          >
            {label}
          </Link>
        ))}

        {/* 💬 Chat icon with inbox popup */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={toggleInbox}
            title="Messages"
            style={{
              position: 'relative',
              background: showInbox ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.12)',
              border: 'none', borderRadius: '50%', width: 38, height: 38,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s',
            }}
          >
            <svg width="19" height="19" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: -4, right: -4,
                background: '#ef4444', color: '#fff', borderRadius: '50%',
                width: 18, height: 18, fontSize: '0.65rem', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid #4338ca',
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

        <button
          onClick={handleLogout}
          style={{
            background: '#1e1b6e', color: '#fff', border: 'none',
            padding: '7px 18px', borderRadius: 7, fontWeight: 600,
            cursor: 'pointer', fontSize: '0.9rem',
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
    <>
      <Navbar
        unreadCount={unreadCount}
        onOpenChat={openChat}
        onUnreadChange={refreshUnread}
      />

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

      {/* Floating chat window — persists across page navigation */}
      {chatPartner && (
        <ChatWindow
          partner={chatPartner}
          onClose={() => { setChatPartner(null); refreshUnread(); }}
          onUnreadChange={refreshUnread}
        />
      )}
    </>
  );
}

export default App;
