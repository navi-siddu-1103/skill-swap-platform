import React, { useState, useEffect } from 'react';

const SplashScreen = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing platform...');
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Smooth progress counter simulation over ~1.6 seconds
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const increment = Math.floor(Math.random() * 9) + 5;
        const next = prev + increment;
        return next > 100 ? 100 : next;
      });
    }, 60);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress < 30) {
      setStatusText('Connecting to Skill Swap network...');
    } else if (progress < 65) {
      setStatusText('Matching skills & opportunities...');
    } else if (progress < 95) {
      setStatusText('Setting up your workspace...');
    } else {
      setStatusText('Ready! Welcome to Skill Swap.');

      // Fade out transition after reaching 100%
      const fadeTimer = setTimeout(() => {
        setIsFadingOut(true);
      }, 250);

      // Finish and remove splash screen
      const endTimer = setTimeout(() => {
        if (onFinish) onFinish();
      }, 700);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(endTimer);
      };
    }
  }, [progress, onFinish]);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      if (onFinish) onFinish();
    }, 200);
  };

  return (
    <div
      onClick={handleSkip}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 50% 30%, #312e81 0%, #1e1b4b 50%, #0f172a 100%)',
        color: '#ffffff',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        transition: 'opacity 0.45s ease-out, transform 0.45s ease-out',
        opacity: isFadingOut ? 0 : 1,
        transform: isFadingOut ? 'scale(1.04)' : 'scale(1)',
        pointerEvents: isFadingOut ? 'none' : 'auto',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      <style>{`
        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 0 35px rgba(99, 102, 241, 0.45), 0 0 70px rgba(129, 140, 248, 0.2);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 50px rgba(99, 102, 241, 0.7), 0 0 95px rgba(129, 140, 248, 0.35);
            transform: scale(1.03);
          }
        }

        @keyframes rotateCycle {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes floatEffect {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }

        @keyframes shimmerLine {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      {/* Background Decorative Blur Orbs */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '25%',
          width: 320,
          height: 320,
          background: 'rgba(99, 102, 241, 0.25)',
          borderRadius: '50%',
          filter: 'blur(90px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '25%',
          right: '25%',
          width: 300,
          height: 300,
          background: 'rgba(168, 85, 247, 0.2)',
          borderRadius: '50%',
          filter: 'blur(90px)',
          pointerEvents: 'none',
        }}
      />

      {/* Main Glassmorphic Container */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '48px 40px 36px',
          borderRadius: '24px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.35)',
          maxWidth: '420px',
          width: '90%',
          animation: 'floatEffect 3.5s ease-in-out infinite',
        }}
      >
        {/* Animated App Logo Icon */}
        <div
          style={{
            position: 'relative',
            width: 90,
            height: 90,
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Outer Rotating Glowing Ring */}
          <div
            style={{
              position: 'absolute',
              inset: -6,
              borderRadius: '50%',
              background: 'conic-gradient(from 0deg, #6366f1, #a855f7, #06b6d4, #6366f1)',
              animation: 'rotateCycle 4s linear infinite',
              filter: 'blur(3px)',
              opacity: 0.85,
            }}
          />

          {/* Inner Badge */}
          <div
            style={{
              position: 'relative',
              width: 86,
              height: 86,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #4338ca 0%, #312e81 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'pulseGlow 2.5s ease-in-out infinite',
              border: '2px solid rgba(255, 255, 255, 0.25)',
            }}
          >
            {/* Custom Skill Swap Icon (Curved Exchange Arrows) */}
            <svg
              width="44"
              height="44"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 3h5v5" />
              <path d="M4 20L21 3" />
              <path d="M21 16v5h-5" />
              <path d="M15 15l6 6" />
              <path d="M4 4l5 5" />
            </svg>
          </div>
        </div>

        {/* Brand Title */}
        <h1
          style={{
            margin: '0 0 6px 0',
            fontSize: '2.1rem',
            fontWeight: 800,
            letterSpacing: '-0.5px',
            background: 'linear-gradient(135deg, #ffffff 30%, #c7d2fe 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center',
          }}
        >
          Skill Swap
        </h1>

        {/* Tagline */}
        <p
          style={{
            margin: '0 0 28px 0',
            fontSize: '0.85rem',
            fontWeight: 600,
            letterSpacing: '1.8px',
            textTransform: 'uppercase',
            color: '#a5b4fc',
            textAlign: 'center',
          }}
        >
          Connect • Learn • Grow
        </p>

        {/* Progress Bar Container */}
        <div style={{ width: '100%', maxWidth: '280px', marginBottom: 14 }}>
          <div
            style={{
              width: '100%',
              height: '7px',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              borderRadius: '999px',
              overflow: 'hidden',
              boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.4)',
              position: 'relative',
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #6366f1 0%, #a855f7 60%, #38bdf8 100%)',
                borderRadius: '999px',
                transition: 'width 0.12s ease-out',
                boxShadow: '0 0 12px rgba(129, 140, 248, 0.85)',
              }}
            />
          </div>
        </div>

        {/* Status text & percentage */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            maxWidth: '280px',
            fontSize: '0.78rem',
            color: '#cbd5e1',
          }}
        >
          <span style={{ fontWeight: 500, opacity: 0.9 }}>{statusText}</span>
          <span style={{ fontWeight: 700, color: '#a5b4fc' }}>{progress}%</span>
        </div>
      </div>

      {/* Skip Hint */}
      <div
        style={{
          position: 'absolute',
          bottom: 28,
          fontSize: '0.75rem',
          color: 'rgba(255, 255, 255, 0.45)',
          letterSpacing: '0.5px',
        }}
      >
        Click anywhere to enter directly
      </div>
    </div>
  );
};

export default SplashScreen;
