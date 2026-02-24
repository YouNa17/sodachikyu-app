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

  // 見た目用（Tailwindは動的に色クラス作りづらいので、色は style で最小限に）
  const categoryMeta: Record<number, { icon: string; color: string }> = {
    1: { icon: '👜', color: '#FFADAD' },
    2: { icon: '🥗', color: '#CAFFBF' },
    3: { icon: '🏠', color: '#9BF6FF' },
    4: { icon: '♻️', color: '#FFD6A5' },
  };

  return (
    <main className="min-h-screen bg-cyan-50 px-5 py-10 text-center">
      {/* 🏠 ホームへ戻るボタン */}
      <div className="mx-auto max-w-[400px] text-left">
        <button
          onClick={() => router.push('/home')}
          className="inline-flex items-center rounded-full bg-white px-5 py-2 text-sm font-bold text-teal-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
        >
          〈 ホームへ戻る
        </button>
      </div>

      <h1 className="mt-5 text-2xl font-bold text-teal-700">カテゴリーをえらぶ</h1>
      <p className="mt-2 text-sm text-teal-700">今からどこから地球を救う？ 🌱</p>

      {/* カテゴリーボタン一覧 */}
      <div className="relative z-10 mx-auto mt-10 grid max-w-[420px] grid-cols-2 gap-6">
        {categories.map((cat) => {
          const meta = categoryMeta[cat.id] ?? { icon: '🌱', color: '#ddd' };

          return (
            <button
              key={cat.id}
              onClick={() => router.push(`/categories/${cat.id}`)}
              className={[
                // 見た目
                'rounded-[28px] bg-white px-3 py-7 shadow-md',
                // 中身配置
                'flex flex-col items-center',
                // ふわっと浮く
                'transform transition duration-200 ease-out',
                'hover:-translate-y-1 hover:shadow-xl',
                'active:translate-y-0 active:shadow-md',
                // フォーカス
                'focus:outline-none focus:ring-4 focus:ring-teal-200',
              ].join(' ')}
            >
              <span className="mb-3 text-5xl">{meta.icon}</span>

              <span className="text-base font-bold text-slate-800">{cat.name}</span>

              <span className="mt-3 h-[5px] w-10 rounded-[3px]" style={{ backgroundColor: meta.color }} />
            </button>
          );
        })}
      </div>
    </main>
  );
}