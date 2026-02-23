'use client';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { fetchWithAuth } from '@/lib/api';

type Action = {
  id: number;
  title: string;
  description: string;
  done_today: boolean;
};

// ✅ カテゴリ別：達成後メッセージ＋背景色
const finishByCategory: Record<number, { message: string; bg: string }> = {
  1: {
    message: 'すてきです！日常の小さな選択が、未来の環境を守ります。',
    bg: '#FFF7ED', // orange-50 相当
  },
  2: {
    message: 'すばらしいです！食べ物が無駄にならずにすみました。',
    bg: '#ECFDF5', // emerald-50 相当
  },
  3: {
    message: 'いいですね！エネルギーの無駄を減らしました。',
    bg: '#EFF6FF', // sky/blue-50 相当
  },
  4: {
    message: 'すてきです！ごみを減らし、地球への負担を減らすことができました。',
    bg: '#FAF5FF', // purple-50 相当
  },
};

export default function ActionListPage() {
  const params = useParams();
  const router = useRouter();

  const categoryId = params.id as string;
  const categoryIdNum = useMemo(() => Number(categoryId), [categoryId]);

  const [actions, setActions] = useState<Action[]>([]);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [isFinished, setIsFinished] = useState(false);
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

    if (categoryId) loadActions();
  }, [categoryId]);

  // カテゴリ名取得
  useEffect(() => {
    async function loadCategoryName() {
      try {
        const categories = await fetchWithAuth('/api/categories');

        const category = categories.find(
          (c: { id: number; name: string }) => c.id === Number(categoryId),
        );

        if (category) setCategoryName(category.name);
      } catch (err) {
        console.error(err);
      }
    }

    if (categoryId) loadCategoryName();
  }, [categoryId]);

  // status取得
  useEffect(() => {
    async function loadStatus() {
      try {
        const data = await fetchWithAuth('/api/status/today');
        setCurrentCount(data.action_count_today);
      } catch (err) {
        console.error(err);
      }
    }

    loadStatus();
  }, []);

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

  // ✅ 達成後：カテゴリ別設定（なければデフォルト）
  const finishCfg = finishByCategory[categoryIdNum] ?? {
    message: 'ナイスアクション！🌱',
    bg: 'white',
  };

  // ✅ モーダルを関数に分離（見た目はそのまま）
  const renderActionModal = () => {
    if (!selectedAction || isFinished) return null;

    return (
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
            width: '100%',
          }}
        >
          {/* ✅ タイトルを赤＋下線で強調 */}
          <h2
            style={{
              fontWeight: 'bold',
              color: '#E53E3E',
              fontSize: '18px',
              borderBottom: '2px solid #FED7D7',
              paddingBottom: '6px',
            }}
          >
            {selectedAction.title}
          </h2>

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
    );
  };

  // ✅ 達成後画面も関数に分離（見た目はほぼそのまま）
  const renderFinishedOverlay = () => {
    if (!isFinished) return null;

    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: finishCfg.bg, // ★カテゴリ別背景色
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2000,
          padding: 20,
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
            textAlign: 'center',
            maxWidth: 420,
          }}
        >
          {finishCfg.message}
        </div>

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
            src="/smile.jpg"
            alt="ちきゅまる"
            fill
            sizes="200px"
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>

        <h2 style={{ marginTop: '20px' }}>{currentCount}回目のアクション！</h2>

        <div style={{ display: 'grid', gap: '10px', marginTop: '30px', width: '250px' }}>
          <button
            onClick={() => {
              setIsFinished(false);
              setSelectedAction(null);
              router.push('/categories');
            }}
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
            onClick={() => {
              setIsFinished(false);
              setSelectedAction(null);
              router.push('/home');
            }}
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
    );
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

      {/* ✅ 追加：見守りちきゅまる（既存構造は壊さない） */}
      <div
        style={{
          marginTop: 16,
          marginBottom: 12,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <div
          style={{
            backgroundColor: 'white',
            border: '2px solid #48BB78',
            borderRadius: 20,
            padding: '6px 14px',
            fontSize: 14,
            fontWeight: 'bold',
            color: '#2F855A',
            boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
          }}
        >
          わくわく！どれに挑戦する？ 🌱
        </div>

        <div
          style={{
            position: 'relative',
            width: 90,
            height: 90,
            borderRadius: '50%',
            overflow: 'hidden',
            border: '3px solid #48BB78',
            backgroundColor: 'white',
          }}
        >
          <Image
            src="/smile.jpg"
            alt="ちきゅまる"
            fill
            sizes="90px"
            style={{ objectFit: 'cover' }}
          />
        </div>
      </div>

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
                border: isDone ? '2px solid #AFCFC0' : '2px solid #E2E8F0',
                backgroundColor: isDone ? '#F0FFF4' : 'white',
                textAlign: 'left',
                fontWeight: 'bold',
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

      {renderActionModal()}
      {renderFinishedOverlay()}
    </main>
  );
}
