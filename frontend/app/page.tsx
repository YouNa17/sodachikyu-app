'use client';

import { useState } from 'react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const onSignup = async () => {
    setMsg('（いまはモック）登録ボタンが押されました');
  };

  return (
    <main style={{ padding: 24, display: 'grid', gap: 12, maxWidth: 420 }}>
      <h1>新規登録</h1>

      <input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ padding: 10 }}
      />

      <input
        type="password"
        placeholder="password（6文字以上）"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ padding: 10 }}
      />

      <button onClick={onSignup} style={{ padding: 10 }}>
        登録
      </button>

      {msg && <p>{msg}</p>}
    </main>
  );
}
