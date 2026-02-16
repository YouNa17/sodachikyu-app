'use client';

import { useMemo, useState } from 'react';

type Action = {
  id: string;
  title: string;
  point?: number;
  desc?: string;
};

type View = 'list' | 'detail';

// 🌏 1) コンポーネント外に移動（Propsで受け取る）
const Chikyumaru = ({
  size: baseSize = 160,
  actionCount,
}: {
  size?: number;
  actionCount: number;
}) => {
  const isHappy = actionCount >= 5;
  const imageUrl = isHappy ? '/happy.jpg' : '/normal.jpg';
  const size = isHappy ? baseSize * 1.2 : baseSize;

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundImage: `url("${imageUrl}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '50%',
        border: '6px solid white',
        boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
        margin: '0 auto 14px',
        transition: 'all 0.5s ease',
      }}
      aria-label="ちきゅまる"
    />
  );
};

export default function HomePage() {
  // ✅ Hooksは必ずここで呼び切る
  const [actionCount, setActionCount] = useState(0);
  const [view, setView] = useState<View>('list');
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);

  // サンプル：ホームで見せるアクション一覧（必要なら差し替えOK）
  const actions = useMemo<Action[]>(
    () => [
      { id: 'w1', title: 'マイバッグを使う', point: 1, desc: 'レジ袋を減らすよ' },
      { id: 'f1', title: '残さず食べる', point: 1, desc: '食品ロスを減らすよ' },
      { id: 'e1', title: '電気をこまめに消す', point: 1, desc: 'ムダな消費を減らすよ' },
      { id: 'm1', title: '近距離は歩く', point: 1, desc: '移動のCO2を減らすよ' },
      { id: 'b1', title: '必要な分だけ買う', point: 1, desc: 'ムダ買いを減らすよ' },
    ],
    [],
  );

  const handleOpenDetail = (a: Action) => {
    setSelectedAction(a);
    setView('detail');
  };

  const handleBack = () => {
    setView('list');
    setSelectedAction(null);
  };

  const handleDone = () => {
    // ✅ setActionCount を使う（unused回避）
    setActionCount((prev) => prev + 1);
    // ここでFirebase保存をしたいなら、awaitしてから戻す等に拡張
    handleBack();
  };

  const handleReset = () => {
    setActionCount(0);
    handleBack();
  };

  // ✅ return は1回に統一（Hooks順序事故を防ぐ）
  return (
    <main style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>そだちきゅ</h1>

        <Chikyumaru actionCount={actionCount} />

        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 14, color: '#0f766e' }}>
            いまのアクション回数：<b>{actionCount}</b>
          </div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 6 }}>5回でごきげんモード 🌱</div>
        </div>

        {view === 'detail' && selectedAction ? (
          <div style={detailBoxStyle}>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>
              {selectedAction.title}
            </div>
            <div style={{ color: '#475569', fontSize: 14, marginBottom: 14 }}>
              {selectedAction.desc ?? 'このアクションで地球が元気になるよ！'}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button style={secondaryBtn} onClick={handleBack}>
                もどる
              </button>
              <button style={primaryBtn} onClick={handleDone}>
                できた！
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ fontWeight: 700, marginBottom: 10, color: '#0f766e' }}>
              今日のミニアクション
            </div>

            <div style={listStyle}>
              {actions.map((a) => (
                <button key={a.id} style={listItemStyle} onClick={() => handleOpenDetail(a)}>
                  <span style={{ fontWeight: 700 }}>{a.title}</span>
                  <span style={{ fontSize: 12, color: '#64748b' }}>
                    {a.point ? `+${a.point}` : ''}
                  </span>
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 14 }}>
              <button style={ghostBtn} onClick={handleReset}>
                リセット（動作確認用）
              </button>
            </div>

            {/* 例：別サイズでも使える */}
            <div style={{ marginTop: 18, opacity: 0.9 }}>
              <Chikyumaru size={90} actionCount={actionCount} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

const containerStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 20,
  background: '#e0f7fa',
};

const cardStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: 420,
  background: 'rgba(255,255,255,0.94)',
  borderRadius: 28,
  padding: 18,
  boxShadow: '0 16px 40px rgba(0,0,0,0.12)',
  border: '2px solid white',
};

const titleStyle: React.CSSProperties = {
  textAlign: 'center',
  margin: '4px 0 12px',
  fontSize: 26,
  fontWeight: 900,
  color: '#0f766e',
};

const listStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
};

const listItemStyle: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 14px',
  borderRadius: 16,
  border: '1px solid #e2e8f0',
  background: 'white',
  cursor: 'pointer',
};

const detailBoxStyle: React.CSSProperties = {
  border: '1px solid #e2e8f0',
  background: 'white',
  borderRadius: 18,
  padding: 14,
};

const primaryBtn: React.CSSProperties = {
  flex: 1,
  padding: '12px 14px',
  borderRadius: 16,
  border: 'none',
  cursor: 'pointer',
  fontWeight: 800,
  background: '#48BB78',
  color: 'white',
};

const secondaryBtn: React.CSSProperties = {
  flex: 1,
  padding: '12px 14px',
  borderRadius: 16,
  border: '1px solid #cbd5e1',
  cursor: 'pointer',
  fontWeight: 800,
  background: 'white',
  color: '#0f766e',
};

const ghostBtn: React.CSSProperties = {
  border: 'none',
  background: 'transparent',
  color: '#0f766e',
  textDecoration: 'underline',
  cursor: 'pointer',
  fontSize: 12,
};
