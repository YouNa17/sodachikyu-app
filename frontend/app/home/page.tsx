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
  // ✅ Hooksは必ずここで呼び切る
  const [actionCount, setActionCount] = useState<number>(0);
  const [message, setMessage] = useState<string>('');
  const [earthState, setEarthState] = useState<'normal' | 'smile' | 'happy'>('normal');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ★ APIから取得
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

  if (loading) {
    return <div>読み込み中...</div>;
  }

  // ✅ return は1回に統一（Hooks順序事故を防ぐ）
  return (
    <main style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>そだちきゅ</h1>

        <EarthCharacter earthState={earthState} />

        <div
          style={{
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
          }}
        >
          {message}
        </div>

        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 14, color: '#0f766e' }}>
            今日のアクション回数：<b>{actionCount}</b>
          </div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 6 }}>5回でごきげんモード 🌱</div>
        </div>

        {/* ★ 仮追加：カテゴリへボタン */}
        <button
          onClick={() => router.push('/categories')}
          style={{
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
          }}
        >
          ミニアクションをする
        </button>
      </div>

      {/* 👇 支援ボタンの追加 白枠の外に出す */}
      <button
        onClick={() => router.push('/support')}
        style={{
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
        }}
      >
        そだちきゅを応援する 🌱
      </button>
    </main>
  );

  {
    /* {view === 'detail' && selectedAction ? (
          <div style={detailBoxStyle}>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>
              {selectedAction.title}
            </div>
            <div style={{ color: '#475569', fontSize: 14, marginBottom: 14 }}>
              {selectedAction.desc ?? 'このアクションで地球が元気になるよ！'}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button style={secondaryBtn} onClick={handleBack}>
                もどる
              </button>
              <button style={primaryBtn} onClick={handleDone}>
                できた！
              </button> */
  }
  {
    /* </div> */
  }
  {
    /* </div>
        ) : (
          <div>
            <div style={{ fontWeight: 700, marginBottom: 10, color: '#0f766e' }}>
              今日のミニアクション
            </div>

            <div style={listStyle}>
              {actions.map((a) => (
                <button key={a.id} style={listItemStyle} onClick={() => handleOpenDetail(a)}>
                  <span style={{ fontWeight: 700 }}>{a.title}</span>
                  <span style={{ fontSize: 12, color: '#64748b' }}>
                    {a.point ? `+${a.point}` : ''}
                  </span>
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 14 }}>
              <button style={ghostBtn} onClick={handleReset}>
                リセット（動作確認用）
              </button>
            </div> */
  }

  {
    /* 例：別サイズでも使える */
  }
  {
    /* <div style={{ marginTop: 18, opacity: 0.9 }}>
              <Chikyumaru size={90} actionCount={actionCount} />
            </div>
          </div>
        )} */
  }
}

const containerStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column', // ← ★支援ボタンを白枠外におきたいため、追加
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

// const listStyle: React.CSSProperties = {
//   display: 'flex',
//   flexDirection: 'column',
//   gap: 10,
// };

// const listItemStyle: React.CSSProperties = {
//   width: '100%',
//   display: 'flex',
//   justifyContent: 'space-between',
//   alignItems: 'center',
//   padding: '12px 14px',
//   borderRadius: 16,
//   border: '1px solid #e2e8f0',
//   background: 'white',
//   cursor: 'pointer',
// };

// const detailBoxStyle: React.CSSProperties = {
//   border: '1px solid #e2e8f0',
//   background: 'white',
//   borderRadius: 18,
//   padding: 14,
// };

// const primaryBtn: React.CSSProperties = {
//   flex: 1,
//   padding: '12px 14px',
//   borderRadius: 16,
//   border: 'none',
//   cursor: 'pointer',
//   fontWeight: 800,
//   background: '#48BB78',
//   color: 'white',
// };

// const secondaryBtn: React.CSSProperties = {
//   flex: 1,
//   padding: '12px 14px',
//   borderRadius: 16,
//   border: '1px solid #cbd5e1',
//   cursor: 'pointer',
//   fontWeight: 800,
//   background: 'white',
//   color: '#0f766e',
// };

// const ghostBtn: React.CSSProperties = {
//   border: 'none',
//   background: 'transparent',
//   color: '#0f766e',
//   textDecoration: 'underline',
//   cursor: 'pointer',
//   fontSize: 12,
// };
