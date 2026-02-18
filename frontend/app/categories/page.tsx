'use client';

import Image from 'next/image';
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
        position: 'relative',
        overflow: 'hidden',
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

      {/* 🌏 1つ目のちきゅまる（左下） */}
      <div
        style={{
          position: 'absolute',
          bottom: '80px',
          left: '12%',
          width: '150px',
          height: '150px',
          zIndex: 10,
          animation: 'float1 3s ease-in-out infinite',
        }}
      >
        {/* 💬 吹き出し */}
        <div
          style={{
            position: 'absolute',
            top: '-70px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'white',
            padding: '10px 20px',
            borderRadius: '25px',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#00796b',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            border: '3px solid #48BB78',
          }}
        >
          どれに挑戦する〜？
          <div
            style={{
              position: 'absolute',
              bottom: '-12px',
              left: '50%',
              transform: 'translateX(-50%)',
              borderTop: '12px solid #48BB78',
              borderLeft: '12px solid transparent',
              borderRight: '12px solid transparent',
            }}
          ></div>
        </div>

        {/* 本体画像 */}
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '6px solid white',
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
            position: 'relative',
          }}
        >
          <Image
            src="/normal.jpg"
            alt="ちきゅまる"
            fill
            sizes="150px"
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
      </div>

      {/* 🌏 2つ目のちきゅまる（右上） */}
      <div
        style={{
          position: 'absolute',
          top: '120px',
          right: '10%',
          width: '170px',
          height: '170px',
          borderRadius: '50%',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          border: '6px solid white',
          zIndex: 5,
          animation: 'float2 4s ease-in-out infinite 1s',
        }}
      >
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <Image
            src="/normal.jpg"
            alt="ちきゅまる"
            fill
            sizes="170px"
            style={{ objectFit: 'cover' }}
          />
        </div>
      </div>

      {/* カテゴリーボタン一覧 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '25px',
          maxWidth: '420px',
          margin: '40px auto',
          position: 'relative',
          zIndex: 15,
        }}
      >
        {categories.map((cat) => {
          const meta = categoryMeta[cat.id] || { icon: '🌱', color: '#ddd' };
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
              <span style={{ fontWeight: 'bold', color: '#333', fontSize: '16px' }}>
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
              ></div>
            </button>
          );
        })}
      </div>

      {/* アニメーションCSS設定 */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes float1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(-5deg); }
        }
      `,
        }}
      />
    </main>
  );
}
