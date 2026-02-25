'use client';

import { useEffect, useState } from 'react';
import { fetchWithAuth } from '@/lib/api';
import { useRouter } from 'next/navigation';
import EarthCharacter from '@/components/EarthCharacter';

type StatusResponse = {
  server_date: string;
  action_count_today: number;
  earth_state: 'normal' | 'smile' | 'happy';
  message: string;
};

export default function HomePage() {
  const [actionCount, setActionCount] = useState<number>(0);
  const [message, setMessage] = useState<string>('');
  const [earthState, setEarthState] = useState<'normal' | 'smile' | 'happy'>('normal');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 👇 押してるボタンを覚える（スマホの押した感）
  const [pressed, setPressed] = useState<'action' | 'support' | null>(null);

  useEffect(() => {
    async function loadStatus() {
      try {
        const data: StatusResponse = await fetchWithAuth('/api/status/today');
        setActionCount(data.action_count_today);
        setMessage(data.message);
        setEarthState(data.earth_state);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadStatus();
  }, []);

  if (loading) return <div>読み込み中...</div>;

  return (
    <main style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>そだちきゅ</h1>

        <EarthCharacter earthState={earthState} />

        <div style={msgBoxStyle}>{message}</div>

        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 14, color: '#0f766e' }}>
            今日のアクション回数：<b>{actionCount}</b>
          </div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 6 }}>5回でごきげんモード 🌱</div>
        </div>

        {/* ミニアクション */}
        <button
          onClick={() => router.push('/categories')}
          onTouchStart={() => setPressed('action')}
          onTouchEnd={() => setPressed(null)}
          onTouchCancel={() => setPressed(null)}
          style={{
            ...primaryButtonStyle,
            transform: pressed === 'action' ? 'scale(0.97)' : 'scale(1)',
          }}
        >
          ミニアクションをする
        </button>
      </div>

      {/* 応援 */}
      <button
        onClick={() => router.push('/support')}
        onTouchStart={() => setPressed('support')}
        onTouchEnd={() => setPressed(null)}
        onTouchCancel={() => setPressed(null)}
        style={{
          ...supportButtonStyle,
          transform: pressed === 'support' ? 'scale(0.98)' : 'scale(1)',
        }}
      >
        そだちきゅを応援する 🌱
      </button>
    </main>
  );
}

const containerStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 20,
  background: '#e0f7fa',
};

const cardStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: 420,
  background: 'rgba(255,255,255,0.94)',
  borderRadius: 28,
  padding: 18,
  boxShadow: '0 16px 40px rgba(0,0,0,0.12)',
  border: '2px solid white',
};

const titleStyle: React.CSSProperties = {
  textAlign: 'center',
  margin: '4px 0 12px',
  fontSize: 26,
  fontWeight: 900,
  color: '#0f766e',
};

const msgBoxStyle: React.CSSProperties = {
  marginTop: 16,
  padding: '12px 16px',
  background: '#ecfdf5',
  borderRadius: '14px',
  border: '1px solid #bbf7d0',
  fontSize: 15,
  fontWeight: 600,
  color: '#065f46',
  textAlign: 'center',
  boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
};

const primaryButtonStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px',
  borderRadius: '20px',
  border: 'none',
  backgroundColor: '#48BB78',
  color: 'white',
  fontWeight: 'bold',
  fontSize: '16px',
  cursor: 'pointer',
  marginTop: '10px',
  transition: 'transform 120ms ease-out, box-shadow 120ms ease-out',
};

const supportButtonStyle: React.CSSProperties = {
  marginTop: 16,
  width: '100%',
  maxWidth: 420,
  padding: '10px',
  borderRadius: 999,
  border: '1px solid #86efac',
  backgroundColor: '#ffffff',
  color: '#065f46',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'transform 120ms ease-out, box-shadow 120ms ease-out',
};
