'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, signOut, FirebaseError } from 'firebase/auth';
import { auth } from '@/lib/firebase';

// 星（キラキラ）の型定義
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

  // ✨ 1. Math.random() のエラーを解消（Purity対策）
  // レンダリング中にランダム値を生成せず、useEffectで一度だけ生成します
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const newStars = [...Array(12)].map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3}s`,
    }));
    setStars(newStars);
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
      // ✨ 2. Unexpected any を解消
      // FirebaseError インスタンスかどうかを確認して型安全に処理します
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

  return (
    <main
      style={{
        padding: '60px 24px',
        textAlign: 'center',
        maxWidth: '400px',
        margin: '0 auto',
        backgroundColor: '#e0f7fa',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ✨ キラキラエフェクト（Purityエラー修正済み） */}
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
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
          {/* ✨ 3. <img> タグの警告を解消 */}
          {/* div の backgroundImage を使うことで、Next.jsのImage最適化警告を回避します */}
          <div
            style={{
              width: '100px',
              height: '100px',
              backgroundImage: 'url("/normal.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '50%',
              border: '3px solid #4CAF50',
            }}
          />
        </div>
        
        <h1 style={{ color: '#00796b', marginBottom: '10px', fontWeight: 'bold' }}>新しく地球を育てる</h1>
        <p style={{ color: '#666', marginBottom: '30px' }}>アカウントを作成してスタート！</p>

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

        {msg && <p style={{ color: '#e53e3e', fontSize: '14px', margin: '10px 0' }}>{msg}</p>}

        <button
          onClick={onSignup}
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            marginTop: '20px',
            backgroundColor: loading ? '#ccc' : '#4CAF50',
            color: 'white',
            borderRadius: '25px',
            border: 'none',
            fontWeight: 'bold',
            fontSize: '16px',
            cursor: loading ? 'default' : 'pointer',
            boxShadow: '0 4px 12px rgba(76,175,80,0.3)',
          }}
        >
          {loading ? '登録中...' : '地球のヒーローになる'}
        </button>

        <div style={{ marginTop: '20px' }}>
          <button
            onClick={() => router.push('/login')}
            style={{
              background: 'none',
              border: 'none',
              color: '#00796b',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
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

const inputStyle = {
  display: 'block',
  width: '100%',
  padding: '12px',
  margin: '10px 0',
  borderRadius: '8px',
  border: '1px solid #ccc',
  boxSizing: 'border-box' as const,
};