'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, signOut, FirebaseError } from 'firebase/auth';
import { auth } from '@/lib/firebase';

// 星の型定義
interface Star {
  top: string;
  left: string;
  delay: string;
}

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ✨ 修正ポイント: useStateの初期化関数でランダム値を生成（Purity/SetStateエラー対策）
  const [stars] = useState<Star[]>(() => 
    [...Array(12)].map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3}s`,
    }))
  );

  // ハイドレーションエラー（サーバーとクライアントの表示差）を防ぐためのフラグ
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const onSignup = async () => {
    if (!email || !password) {
      setMsg('メールアドレスとパスワードを入力してください');
      return;
    }
    if (password.length < 6) {
      setMsg('パスワードは6文字以上で入力してください');
      return;
    }
    setLoading(true);
    setMsg('');

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const allowedEmails = process.env.NEXT_PUBLIC_ALLOWED_EMAILS?.split(',') || [];

      if (allowedEmails.length > 0 && !allowedEmails.includes(result.user.email || '')) {
        setMsg('このアドレスは許可されていません。');
        await signOut(auth);
        return;
      }

      setMsg('登録成功！地球へようこそ！');
      router.push('/home');
    } catch (e: unknown) {
      // ✨ anyを排除
      if (e instanceof FirebaseError) {
        if (e.code === 'auth/email-already-in-use') {
          setMsg('このメールアドレスは既に登録されています');
        } else {
          setMsg('登録に失敗しました: ' + e.message);
        }
      } else {
        setMsg('予期せぬエラーが発生しました');
      }
    } finally {
      setLoading(false);
    }
  };

  // サーバーサイドでのレンダリング時は何も表示しない（ランダム値の不一致を防ぐ）
  if (!mounted) return null;

  return (
    <main style={containerStyle}>
      {/* ✨ キラキラエフェクト */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {stars.map((star, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: star.top,
              left: star.left,
              animation: `twinkle 3s infinite ease-in-out`,
              animationDelay: star.delay,
              fontSize: '24px',
            }}
          >
            ✨
          </div>
        ))}
      </div>

      <div style={{ position: 'relative', zIndex: 10 }}>
        <div style={chikyumaruWrapperStyle}>
          {/* ✨ <img>タグの警告を回避 */}
          <div style={chikyumaruImageStyle} />
        </div>
        
        <h1 style={titleStyle}>新しく地球を育てる</h1>
        <p style={subTitleStyle}>アカウントを作成してスタート！</p>

        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="パスワード（6文字以上）"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        {msg && <p style={errorMsgStyle}>{msg}</p>}

        <button onClick={onSignup} disabled={loading} style={submitButtonStyle(loading)}>
          {loading ? '登録中...' : '地球のヒーローになる'}
        </button>

        <div style={{ marginTop: '20px' }}>
          <button onClick={() => router.push('/login')} style={backButtonStyle}>
            ログイン画面に戻る
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes twinkle { 
          0%, 100% { opacity: 0.3; transform: scale(0.8); } 
          50% { opacity: 1; transform: scale(1.2); } 
        }
      `}} />
    </main>
  );
}

// --- スタイル定義 ---
const containerStyle = { padding: '60px 24px', textAlign: 'center' as const, maxWidth: '400px', margin: '0 auto', backgroundColor: '#e0f7fa', minHeight: '100vh', position: 'relative' as const, overflow: 'hidden' };
const chikyumaruWrapperStyle = { marginBottom: '20px', display: 'flex', justifyContent: 'center' };
const chikyumaruImageStyle = { width: '100px', height: '100px', backgroundImage: 'url("/normal.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '50%', border: '3px solid #4CAF50' };
const titleStyle = { color: '#00796b', marginBottom: '10px', fontWeight: 'bold' as const, fontSize: '24px' };
const subTitleStyle = { color: '#666', marginBottom: '30px' };
const inputStyle = { display: 'block', width: '100%', padding: '12px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' as const };
const errorMsgStyle = { color: '#e53e3e', fontSize: '14px', margin: '10px 0' };
const submitButtonStyle = (loading: boolean) => ({ width: '100%', padding: '14px', marginTop: '20px', backgroundColor: loading ? '#ccc' : '#4CAF50', color: 'white', borderRadius: '25px', border: 'none', fontWeight: 'bold' as const, fontSize: '16px', cursor: loading ? 'default' : 'pointer' });
const backButtonStyle = { background: 'none', border: 'none', color: '#00796b', textDecoration: 'underline', cursor: 'pointer', fontSize: '14px' };