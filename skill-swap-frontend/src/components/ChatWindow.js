import React, { useState, useEffect, useRef, useContext } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';

const ChatWindow = ({ partner, onClose, onUnreadChange }) => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages]   = useState([]);
  const [input, setInput]         = useState('');
  const [connected, setConnected] = useState(false);
  const [loading, setLoading]     = useState(true);
  const stompClientRef            = useRef(null);
  const messagesEndRef            = useRef(null);

  // ── Load history + connect WebSocket ──────────────────────────────────────
  useEffect(() => {
    let isMounted = true;

    // 1. Fetch existing conversation
    api.get(`/chat/history/${user.userId}/${partner.id}`)
      .then(res => { if (isMounted) setMessages(res.data); })
      .catch(() => {})
      .finally(() => { if (isMounted) setLoading(false); });

    // 2. Mark messages from partner as read
    api.post(`/chat/read/${partner.id}/${user.userId}`).catch(() => {});

    // 3. Connect STOMP over SockJS
    const wsUrl = process.env.REACT_APP_WS_URL || 'http://localhost:9091/ws';
    const client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      connectHeaders: { userId: String(user.userId) },
      reconnectDelay: 5000,
      onConnect: () => {
        if (!isMounted) return;
        setConnected(true);

        client.subscribe(`/user/queue/messages`, frame => {
          const msg = JSON.parse(frame.body);
          const fromPartner =
            Number(msg.senderId) === Number(partner.id) &&
            Number(msg.receiverId) === Number(user.userId);

          if (fromPartner && isMounted) {
            setMessages(prev => [...prev, msg]);
            api.post(`/chat/read/${partner.id}/${user.userId}`).catch(() => {});
            if (onUnreadChange) onUnreadChange();
          }
        });
      },
      onStompError: frame => console.error('STOMP error', frame),
      onDisconnect: () => { if (isMounted) setConnected(false); },
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      isMounted = false;
      client.deactivate();
    };
  }, [partner.id, user.userId]); // eslint-disable-line

  // ── Auto-scroll to newest message ─────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Send message ───────────────────────────────────────────────────────────
  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed || !connected || !stompClientRef.current) return;

    const optimisticMsg = {
      id: null,
      senderId:   user.userId,
      receiverId: partner.id,
      content:    trimmed,
      timestamp:  new Date().toISOString(),
      read: false,
    };
    setMessages(prev => [...prev, optimisticMsg]);

    stompClientRef.current.publish({
      destination: '/app/chat.send',
      body: JSON.stringify({
        senderId:   user.userId,
        receiverId: partner.id,
        content:    trimmed,
      }),
    });
    setInput('');
  };

  const handleKey = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{
      position: 'fixed', bottom: 0, right: 24, width: 340, zIndex: 9999,
      borderRadius: '18px 18px 0 0',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6), 0 0 30px rgba(99, 102, 241, 0.3)',
      display: 'flex', flexDirection: 'column',
      background: 'rgba(23, 23, 56, 0.96)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.16)',
      borderBottom: 'none',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    }}>
      {/* ── Header ── */}
      <div style={{
        background: 'linear-gradient(90deg, rgba(67, 56, 202, 0.6) 0%, rgba(99, 102, 241, 0.6) 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#fff', padding: '12px 16px',
        borderRadius: '18px 18px 0 0',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Avatar circle */}
          <div style={{
            width: 38, height: 38, borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            boxShadow: '0 0 12px rgba(99, 102, 241, 0.6)',
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: '1.05rem',
            border: '1.5px solid rgba(255, 255, 255, 0.3)',
          }}>
            {partner.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>
              {partner.username}
            </div>
            <div style={{ fontSize: '0.72rem', color: connected ? '#6ee7b7' : '#94a3b8', display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: connected ? '#10b981' : '#94a3b8',
                boxShadow: connected ? '0 0 8px #10b981' : 'none',
              }} />
              {connected ? 'Online' : 'Connecting…'}
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none', border: 'none', color: '#94a3b8',
            fontSize: '1.4rem', cursor: 'pointer', lineHeight: 1, padding: 4,
          }}
          aria-label="Close chat"
          onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
          onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
        >×</button>
      </div>

      {/* ── Messages Container ── */}
      <div style={{
        height: 310, overflowY: 'auto', padding: '14px 12px 6px',
        background: 'rgba(15, 23, 42, 0.85)',
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        {loading && (
          <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem', marginTop: 80 }}>
            Loading messages…
          </p>
        )}
        {!loading && messages.length === 0 && (
          <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem', marginTop: 80 }}>
            Say hello to <strong style={{ color: '#c7d2fe' }}>{partner.username}</strong> 👋
          </p>
        )}
        {messages.map((msg, i) => {
          const isMine = Number(msg.senderId) === Number(user.userId);
          return (
            <div key={i} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '78%', padding: '9px 14px', borderRadius: 16,
                background: isMine
                  ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                  : 'rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                border: isMine ? 'none' : '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: isMine
                  ? '0 4px 14px rgba(99, 102, 241, 0.35)'
                  : '0 2px 8px rgba(0, 0, 0, 0.25)',
                borderBottomRightRadius: isMine ? 3 : 16,
                borderBottomLeftRadius: isMine ? 16 : 3,
                fontSize: '0.9rem', lineHeight: 1.4,
              }}>
                <div>{msg.content}</div>
                <div style={{
                  fontSize: '0.65rem', marginTop: 3, opacity: 0.75, textAlign: 'right',
                  color: isMine ? '#e0e7ff' : '#94a3b8',
                }}>
                  {msg.timestamp
                    ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : ''}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Input Bar ── */}
      <div style={{
        padding: '10px 12px', borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex', gap: 8, background: 'rgba(23, 23, 56, 0.95)',
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Type a message…"
          disabled={!connected}
          style={{
            flex: 1,
            border: '1px solid rgba(255, 255, 255, 0.16)',
            borderRadius: 20,
            padding: '8px 14px',
            fontSize: '0.88rem',
            outline: 'none',
            background: connected ? 'rgba(255, 255, 255, 0.07)' : 'rgba(255, 255, 255, 0.03)',
            color: '#ffffff',
          }}
          onFocus={e => {
            e.target.style.borderColor = '#818cf8';
            e.target.style.boxShadow = '0 0 0 2px rgba(99, 102, 241, 0.35)';
          }}
          onBlur={e => {
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.16)';
            e.target.style.boxShadow = 'none';
          }}
        />
        <button
          onClick={sendMessage}
          disabled={!connected || !input.trim()}
          aria-label="Send message"
          style={{
            width: 36, height: 36, borderRadius: '50%',
            background: connected && input.trim()
              ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
              : 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            cursor: connected && input.trim() ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: connected && input.trim() ? '0 0 12px rgba(99, 102, 241, 0.6)' : 'none',
            transition: 'all 0.2s', flexShrink: 0,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
