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

        // ✅ Only handle messages FROM the partner.
        // My own messages are already shown via optimistic UI when I hit Send.
        // The server no longer echoes back to sender, so no duplicates possible.
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

    // ✅ Optimistic UI — show message instantly before server confirms
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
      position: 'fixed', bottom: 0, right: 24, width: 320, zIndex: 9999,
      borderRadius: '12px 12px 0 0',
      boxShadow: '0 8px 32px rgba(67,56,202,0.22)',
      display: 'flex', flexDirection: 'column',
      background: '#fff', border: '1px solid #e0e0f0',
    }}>
      {/* ── Header ── */}
      <div style={{
        background: 'linear-gradient(90deg,#4338ca,#6366f1)',
        color: '#fff', padding: '12px 16px',
        borderRadius: '12px 12px 0 0',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Avatar circle */}
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: '#fff2', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: '1.1rem',
          }}>
            {partner.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{partner.username}</div>
            <div style={{ fontSize: '0.73rem', opacity: 0.8 }}>
              {connected ? '🟢 Online' : '⚪ Connecting…'}
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.4rem', cursor: 'pointer', lineHeight: 1 }}
          aria-label="Close chat"
        >×</button>
      </div>

      {/* ── Messages ── */}
      <div style={{
        height: 300, overflowY: 'auto', padding: '12px 12px 4px',
        background: '#f7f8ff', display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        {loading && (
          <p style={{ textAlign: 'center', color: '#aaa', fontSize: '0.85rem', marginTop: 60 }}>
            Loading messages…
          </p>
        )}
        {!loading && messages.length === 0 && (
          <p style={{ textAlign: 'center', color: '#aaa', fontSize: '0.85rem', marginTop: 60 }}>
            Say hello to <strong>{partner.username}</strong> 👋
          </p>
        )}
        {messages.map((msg, i) => {
          // ✅ FIX: Number() cast to safely compare JSON integers with JS numbers
          const isMine = Number(msg.senderId) === Number(user.userId);
          return (
            <div key={i} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '78%', padding: '8px 14px', borderRadius: 18,
                background: isMine ? '#4338ca' : '#fff',
                color: isMine ? '#fff' : '#1f2937',
                border: isMine ? 'none' : '1px solid #e0e0f0',
                boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
                borderBottomRightRadius: isMine ? 4 : 18,
                borderBottomLeftRadius: isMine ? 18 : 4,
                fontSize: '0.9rem', lineHeight: 1.4,
              }}>
                <div>{msg.content}</div>
                <div style={{ fontSize: '0.68rem', marginTop: 3, opacity: 0.65, textAlign: 'right' }}>
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

      {/* ── Input ── */}
      <div style={{
        padding: '10px 12px', borderTop: '1px solid #e8e8f5',
        display: 'flex', gap: 8, background: '#fff',
        borderRadius: '0 0 12px 12px',
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Type a message…"
          disabled={!connected}
          style={{
            flex: 1, border: '1.5px solid #ddd', borderRadius: 20,
            padding: '8px 14px', fontSize: '0.88rem',
            outline: 'none', background: connected ? '#fff' : '#f4f4f4',
          }}
        />
        <button
          onClick={sendMessage}
          disabled={!connected || !input.trim()}
          aria-label="Send"
          style={{
            width: 38, height: 38, borderRadius: '50%',
            background: connected && input.trim() ? '#4338ca' : '#d1d5db',
            border: 'none', cursor: connected && input.trim() ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s', flexShrink: 0,
          }}
        >
          {/* Send icon */}
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
