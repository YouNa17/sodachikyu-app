'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { ACTIONS } from '@/lib/actions'; // 外部から読み込み

export default function ActionListPage() {
  const params = useParams();
  const router = useRouter(); // SPA遷移のために使用
  const categoryId = params.id as string;
  const actions = ACTIONS[categoryId] || [];
  const [selectedAction, setSelectedAction] = useState<{ title: string; detail: string } | null>(
    null,
  );

  const handleDone = () => {
    const savedCount = localStorage.getItem('actionCount');
    const newCount = (savedCount ? parseInt(savedCount) : 0) + 1;
    localStorage.setItem('actionCount', newCount.toString());

    alert('ナイスアクション！地球が喜びました🌟');
    router.push('/home'); // ✅ router.push で滑らかに遷移
  };

  return (
    <main style={{ padding: '20px', maxWidth: '500px', margin: '0 auto', minHeight: '100vh' }}>
      <button
        onClick={() => router.push('/categories')}
        style={{
          background: 'none',
          border: 'none',
          color: '#666',
          cursor: 'pointer',
          marginBottom: '20px',
        }}
      >
        〈 カテゴリー選択へ戻る
      </button>

      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>アクションを選ぼう</h1>

      <div style={{ display: 'grid', gap: '15px' }}>
        {actions.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#999' }}>アクションを準備中です...</p>
        ) : (
          actions.map((action) => (
            <button
              key={action.id}
              onClick={() => setSelectedAction(action)}
              style={{
                padding: '20px',
                borderRadius: '16px',
                border: '1px solid #ddd',
                backgroundColor: 'white',
                textAlign: 'left',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontWeight: 'bold' }}>{action.title}</div>
            </button>
          ))
        )}
      </div>

      {selectedAction && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.7)',
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
              width: '100%',
              maxWidth: '400px',
              textAlign: 'center',
            }}
          >
            <h2>{selectedAction.title}</h2>
            <p style={{ margin: '20px 0', textAlign: 'left' }}>{selectedAction.detail}</p>
            <button
              onClick={handleDone}
              style={{
                width: '100%',
                padding: '15px',
                borderRadius: '30px',
                border: 'none',
                backgroundColor: '#48BB78',
                color: 'white', // ✅ 指摘通り "#white" を修正
                fontWeight: 'bold',
                fontSize: '18px',
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
    </main>
  );
}
