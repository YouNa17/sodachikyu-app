'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchWithAuth } from '@/lib/api';

type Category = {
  id: number;
  name: string;
};

export default function CategoryPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);

  // APIから取得
  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await fetchWithAuth('/api/categories');
        setCategories(data);
      } catch (err) {
        console.error(err);
      }
    }

    loadCategories();
  }, []);

  // 見た目用の設定
  const categoryMeta: Record<number, { icon: string; color: string }> = {
    1: { icon: '👜', color: '#FFADAD' },
    2: { icon: '🥗', color: '#CAFFBF' },
    3: { icon: '🏠', color: '#9BF6FF' },
    4: { icon: '♻️', color: '#FFD6A5' },
  };

  return (
    <main
      style={{
        padding: '40px 20px',
        textAlign: 'center',
        backgroundColor: '#e0f7fa',
        minHeight: '100vh',
      }}
    >
      {/* 🏠 ホームへ戻るボタン */}
      <div style={{ textAlign: 'left', maxWidth: '400px', margin: '0 auto' }}>
        <button
          onClick={() => router.push('/home')}
          style={{
            background: 'white',
            border: 'none',
            color: '#00796b',
            cursor: 'pointer',
            padding: '10px 20px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: 'bold',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          }}
        >
          〈 ホームへ戻る
        </button>
      </div>

      <h1 style={{ color: '#00796b', marginTop: '20px', fontSize: '24px' }}>カテゴリーをえらぶ</h1>
      <p style={{ color: '#00796b', marginBottom: '30px', fontSize: '14px' }}>
        今からどこから地球を救う？ 🌱
      </p>

      {/* カテゴリーボタン一覧 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '25px',
          maxWidth: '420px',
          margin: '40px auto',
        }}
      >
        {categories.map((cat) => {
          const meta = categoryMeta[cat.id] ?? { icon: '🌱', color: '#ddd' };

          return (
            <button
              key={cat.id}
              onClick={() => router.push(`/categories/${cat.id}`)}
              style={{
                padding: '30px 10px',
                borderRadius: '28px',
                border: 'none',
                backgroundColor: 'white',
                boxShadow: '0 6px 15px rgba(0,0,0,0.08)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transition: 'transform 0.2s',
              }}
            >
              <span style={{ fontSize: '50px', marginBottom: '10px' }}>{meta.icon}</span>
              <span
                style={{
                  fontWeight: 'bold',
                  color: '#333',
                  fontSize: '16px',
                }}
              >
                {cat.name}
              </span>
              <div
                style={{
                  width: '40px',
                  height: '5px',
                  backgroundColor: meta.color,
                  marginTop: '10px',
                  borderRadius: '3px',
                }}
              />
            </button>
          );
        })}
      </div>
    </main>
  );
}
