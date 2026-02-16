'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
    } catch (e: any) {
      if (e.code === 'auth/email-already-in-use') {
        setMsg('このメールアドレスは既に登録されています');
      } else {
        setMsg('登録に失敗しました');
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
      }}
    >
      <div style={{ marginBottom: '20px' }}>
        <img
          src="/normal.jpg"
          alt="ちきゅまる"
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            border: '3px solid #4CAF50',
            objectFit: 'cover',
          }}
        />
      </div>
      <h1 style={{ color: '#00796b', marginBottom: '10px' }}>新しく地球を育てる</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>アカウントを作成してスタート！</p>

      <input
        type="email"
        placeholder="メールアドレス"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          display: 'block',
          width: '100%',
          padding: '12px',
          margin: '10px 0',
          borderRadius: '8px',
          border: '1px solid #ccc',
        }}
      />
      <input
        type="password"
        placeholder="パスワード（6文字以上）"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          display: 'block',
          width: '100%',
          padding: '12px',
          margin: '10px 0',
          borderRadius: '8px',
          border: '1px solid #ccc',
        }}
      />

      {msg && <p style={{ color: '#e53e3e', fontSize: '14px', margin: '10px 0' }}>{msg}</p>}

      <button
        onClick={onSignup}
        disabled={loading}
        style={{
          width: '100%',
          padding: '14px',
          marginTop: '20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          borderRadius: '25px',
          border: 'none',
          fontWeight: 'bold',
          fontSize: '16px',
          cursor: 'pointer',
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
    </main>
  );
}
