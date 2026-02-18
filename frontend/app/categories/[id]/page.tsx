'use client';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchWithAuth } from '@/lib/api';

type Action = {
  id: number;
  title: string;
  description: string;
  done_today: boolean;
};

export default function ActionListPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;

  const [actions, setActions] = useState<Action[]>([]);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  // ✅ useEffectでsetStateしない（lintエラー回避）
  const [currentCount, setCurrentCount] = useState(0);
  const [categoryName, setCategoryName] = useState('');

  // actions取得
  useEffect(() => {
    async function loadActions() {
      try {
        const data = await fetchWithAuth(`/api/categories/${categoryId}/actions`);

        setActions(data.actions);
      } catch (err) {
        console.error(err);
      }
    }

    if (categoryId) {
      loadActions();
    }
  }, [categoryId]);

  // カテゴリ名取得
  useEffect(() => {
    async function loadCategoryName() {
      try {
        const categories = await fetchWithAuth('/api/categories');

        const category = categories.find(
          (c: { id: number; name: string }) => c.id === Number(categoryId),
        );

        if (category) {
          setCategoryName(category.name);
        }
      } catch (err) {
        console.error(err);
      }
    }

    if (categoryId) {
      loadCategoryName();
    }
  }, [categoryId]);

  // status取得
  useEffect(() => {
    async function loadStatus() {
      const data = await fetchWithAuth('/api/status/today');

      setCurrentCount(data.action_count_today);
    }

    loadStatus();
  }, []);

  const isOhuro =
    (selectedAction?.title ?? '').includes('湯') || (selectedAction?.title ?? '').includes('水');

  // action実行
  const handleDone = async () => {
    if (!selectedAction) return;

    try {
      const result = await fetchWithAuth(`/api/actions/${selectedAction.id}/action-logs`, {
        method: 'POST',
      });

      setCurrentCount(result.action_count_today);
      setIsFinished(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main
      style={{
        padding: '20px',
        maxWidth: '500px',
        margin: '0 auto',
        minHeight: '100vh',
        backgroundColor: '#F0FFF4',
      }}
    >
      <button
        onClick={() => router.push('/categories')}
        style={{
          background: 'none',
          border: 'none',
          color: '#00796b',
          cursor: 'pointer',
          marginBottom: '20px',
        }}
      >
        〈 カテゴリーへ戻る
      </button>

      <h1 style={{ textAlign: 'center', color: '#2F855A' }}>{categoryName}</h1>

      <div style={{ display: 'grid', gap: '15px', marginTop: '20px' }}>
        {actions.map((a) => {
          const isDone = a.done_today;

          return (
            <button
              key={a.id}
              onClick={() => !isDone && setSelectedAction(a)}
              disabled={isDone}
              style={{
                padding: '18px',
                borderRadius: '16px',
                // ★ 状態で色変更
                border: isDone ? '2px solid #AFCFC0' : '2px solid #E2E8F0',

                backgroundColor: isDone ? '#F0FFF4' : 'white',
                textAlign: 'left',
                fontWeight: 'bold',
                // ★ 文字色を明示（これが重要）
                color: isDone ? '#AFCFC0' : '#0f766e',

                cursor: isDone ? 'not-allowed' : 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>{a.title}</span>

              {isDone && (
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#48BB78',
                  }}
                >
                  ✔ 達成済み
                </span>
              )}
            </button>
          );
        })}
      </div>

      {selectedAction && !isFinished && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.6)',
            color: '#1A202C',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '28px',
              textAlign: 'center',
              maxWidth: '400px',
            }}
          >
            <h2>{selectedAction.title}</h2>
            <p style={{ margin: '20px 0', textAlign: 'left' }}>{selectedAction.description}</p>

            <button
              onClick={handleDone}
              style={{
                width: '100%',
                padding: '15px',
                borderRadius: '30px',
                border: 'none',
                backgroundColor: '#48BB78',
                color: 'white',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              できた！
            </button>

            <button
              onClick={() => setSelectedAction(null)}
              style={{
                marginTop: '15px',
                background: 'none',
                border: 'none',
                color: '#999',
                cursor: 'pointer',
              }}
            >
              とじる
            </button>
          </div>
        </div>
      )}

      {isFinished && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000,
          }}
        >
          <div
            style={{
              backgroundColor: '#EBF8FF',
              color: '#48BB78',
              padding: '15px 25px',
              borderRadius: '20px',
              marginBottom: '20px',
              border: '2px solid #4299E1',
              fontWeight: 'bold',
            }}
          >
            {isOhuro ? 'あ〜極楽極楽…🌍♨️' : 'ナイスアクション！🌱'}
          </div>

          {/* ✅ <img> を <Image> に（no-img-element / alt-text 対策） */}
          <div
            style={{
              position: 'relative',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '4px solid #48BB78',
            }}
          >
            <Image
              src={isOhuro ? '/ohuro.jpg' : '/smile.jpg'}
              alt={isOhuro ? 'お風呂でリラックスするちきゅまる' : 'ちきゅまる'}
              fill
              sizes="200px"
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>

          <h2 style={{ marginTop: '20px' }}>{currentCount}回目のアクション！</h2>

          <div style={{ display: 'grid', gap: '10px', marginTop: '30px', width: '250px' }}>
            <button
              onClick={() => router.push('/categories')}
              style={{
                padding: '15px',
                borderRadius: '30px',
                border: '2px solid #48BB78',
                color: '#48BB78',
                backgroundColor: 'white',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              ほかのアクションもする
            </button>

            <button
              onClick={() => router.push('/home')}
              style={{
                padding: '15px',
                borderRadius: '30px',
                border: 'none',
                backgroundColor: '#48BB78',
                color: 'white',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              ホームへ戻る
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
