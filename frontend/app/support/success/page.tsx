'use client';

import { useRouter } from 'next/navigation';
import EarthCharacter from '@/components/EarthCharacter';

export default function SupportSuccessPage() {
  const router = useRouter();

  return (
    <main style={container}>
      <div style={card}>
        <h1 style={title}>ご支援ありがとうございます 🌱</h1>

        {/* 地球キャラクター：happy */}
        <EarthCharacter earthState="happy" />

        {/* お礼文 */}
        <p style={text}>
          そだちきゅを応援してくれて、ありがとうございます。
          <br />
          あなたの支援は、アプリの運営や機能改善、
          <br />
          そして、地球にやさしい行動を広げるために大切に使われます。
        </p>

        <button onClick={() => router.push('/home')} style={homeBtn}>
          ホームに戻る
        </button>
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
  padding: 20,
};

const card: React.CSSProperties = {
  width: '100%',
  maxWidth: 420,
  background: 'rgba(255,255,255,0.95)',
  borderRadius: 28,
  padding: 22,
  textAlign: 'center',
  boxShadow: '0 16px 40px rgba(0,0,0,0.12)',
};

const title: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 800,
  color: '#0f766e',
  marginBottom: 12,
};

const text: React.CSSProperties = {
  fontSize: 14,
  color: '#374151',
  lineHeight: 1.6,
  margin: '12px 0 20px',
};

const homeBtn: React.CSSProperties = {
  width: '100%',
  padding: 14,
  borderRadius: 22,
  border: 'none',
  background: '#48BB78',
  color: 'white',
  fontWeight: 'bold',
  fontSize: 16,
  cursor: 'pointer',
};