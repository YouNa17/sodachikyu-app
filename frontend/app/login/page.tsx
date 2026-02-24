'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { fetchWithAuth } from '@/lib/api';
import { FirebaseError } from 'firebase/app';

export default function LoginPage() {
  const router = useRouter();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleStart = async () => {
    if (!email || !password) {
      alert('メールアドレスとパスワードを入力してね！');
      return;
    }
    try {
      let userCredential;

      if (isRegisterMode) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }
      await userCredential.user.getIdToken(true);
      await fetchWithAuth('/api/users/me');

      setIsJumping(true);
      setTimeout(() => {
        router.push('/home');
      }, 800);
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        alert('エラーが発生したよ: ' + error.message);
      } else {
        alert('予期せぬエラーが発生したよ');
      }
    }
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e0f7fa',
        position: 'relative',
        overflow: 'hidden',
        padding: '20px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: '340px',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div
          style={{
            width: '180px',
            height: '180px',
            backgroundImage: 'url("/smile.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '50%',
            border: '6px solid white',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            marginBottom: '-40px',
            zIndex: 12,
            animation: isJumping ? 'jumpUp 0.8s forwards' : 'poyon 3s ease-in-out infinite',
          }}
        ></div>

        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(5px)',
            width: '100%',
            padding: '50px 25px 30px 25px',
            borderRadius: '40px',
            boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
            textAlign: 'center',
            zIndex: 11,
            border: '2px solid white',
            animation: isJumping ? 'shake 0.5s ease-in-out' : 'none',
          }}
        >
          <h1
            style={{ color: '#00796b', fontSize: '28px', fontWeight: 'bold', marginBottom: '5px' }}
          >
            そだちきゅ！
          </h1>

          <p style={{ color: '#00695c', fontSize: '14px', marginBottom: '20px' }}>
            {isRegisterMode ? 'あたらしく登録しよう 🌱' : 'いっしょに地球を育てよう 🌱'}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* ★メールアドレス入力を水色に */}
            <input
              type="email"
              placeholder="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                ...inputStyle,
                color: '#00bcd4',
                borderColor: '#4dd0e1'
              }}
            />
            {/* ★パスワード入力を水色に */}
            <input
              type="password"
              placeholder="パスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                ...inputStyle,
                color: '#00bcd4',
                borderColor: '#4dd0e1'
              }}
            />

            {/* ★ボタンを水色に */}
            <button
              onClick={handleStart}
              disabled={isJumping}
              style={{
                padding: '16px',
                backgroundColor: isJumping ? '#ccc' : '#4dd0e1',
                color: 'white',
                borderRadius: '30px',
                border: 'none',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginTop: '10px',
                boxShadow: '0 4px 14px rgba(77, 208, 225, 0.4)',
              }}
            >
              {isJumping ? '出発！' : isRegisterMode ? '登録してはじめる' : 'ログインしてはじめる'}
            </button>

            <button
              onClick={() => setIsRegisterMode(!isRegisterMode)}
              style={{
                background: 'none',
                border: 'none',
                color: '#00796b',
                textDecoration: 'underline',
                fontSize: '13px',
                cursor: 'pointer',
                marginTop: '10px',
              }}
            >
              {isRegisterMode ? 'ログイン画面にもどる' : 'あたらしく登録する方はこちら'}
            </button>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `@keyframes poyon { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } } @keyframes jumpUp { 0% { transform: translateY(0) scale(1.1); } 20% { transform: translateY(20px) scale(0.9, 1.1); } 100% { transform: translateY(-1000px) scale(1); } } @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } } @keyframes twinkle { 0%, 100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); } } .star { animation: twinkle 3s infinite ease-in-out; }`,
        }}
      />
    </main>
  );
}

const inputStyle = {
  width: '100%',
  padding: '12px 15px',
  borderRadius: '20px',
  border: '1px solid #ccc',
  fontSize: '15px',
  outline: 'none',
  boxSizing: 'border-box' as const,
};