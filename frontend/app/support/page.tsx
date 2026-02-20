'use client';

import { useState } from 'react';
import { fetchWithAuth } from '@/lib/api';
import { useRouter } from 'next/navigation';
import EarthCharacter from '@/components/EarthCharacter';

export default function SupportPage() {
  const router = useRouter();
  const [amount, setAmount] = useState<number>(300);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSupport = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetchWithAuth('/api/support', {
        method: 'POST',
        body: JSON.stringify({ amount }),
      });

      // checkout_url にリダイレクト
      window.location.href = res.checkout_url;
    } catch (e) {
      console.error(e);
      setError('決済の開始に失敗しました');
      setLoading(false);
    }
  };

  return (
    <main style={container}>
      <div style={card}>
        <h1 style={title}>そだちきゅ応援 🌱</h1>

        <EarthCharacter earthState="smile" />
        
        {/* 説明文 */}
        <p style={text}>
          いただいた支援は、アプリ運営や機能改善、  
          そだちきゅをもっと使いやすくするための開発に使われます。
        </p>
        
        {/* 金額選択 */}
        <div style={amountBox}>
          {[100, 300, 500].map((v) => (
            <button
              key={v}
              onClick={() => setAmount(v)}
              style={{
                ...amountBtn,
                background: amount === v ? '#48BB78' : '#e5e7eb',
                color: amount === v ? 'white' : '#374151',
              }}
            >
              ¥{v}
            </button>
          ))}
        </div>
        
        {/* 支援する */}
        <button onClick={onSupport} disabled={loading} style={supportBtn}>
          {loading ? '処理中...' : 'この金額で支援する'}
        </button>

        {/* やめる */}
        <button onClick={() => router.push('/home')} style={cancelBtn}>
          やめる
        </button>

        {error && <p style={{ color: 'red', marginTop: 8 }}>{error}</p>}
      </div>
    </main>
  );
}

/* =====================
   styles
===================== */

const container: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: '#e0f7fa',
};

const card: React.CSSProperties = {
  width: '100%',
  maxWidth: 420,
  background: 'white',
  borderRadius: 24,
  padding: 20,
  textAlign: 'center',
};

const title: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 800,
  color: '#0f766e',
};

const text: React.CSSProperties = {
  fontSize: 14,
  color: '#374151',
  margin: '12px 0',
};

const amountBox: React.CSSProperties = {
  display: 'flex',
  gap: 10,
  justifyContent: 'center',
  marginBottom: 16,
};

const amountBtn: React.CSSProperties = {
  padding: '10px 14px',
  borderRadius: 16,
  border: 'none',
  fontWeight: 700,
  cursor: 'pointer',
};

const supportBtn: React.CSSProperties = {
  width: '100%',
  padding: 14,
  borderRadius: 20,
  border: 'none',
  background: '#48BB78',
  color: 'white',
  fontWeight: 'bold',
  fontSize: 16,
};

const cancelBtn: React.CSSProperties = {
  marginTop: 10,
  background: 'transparent',
  border: 'none',
  color: '#64748b',
};