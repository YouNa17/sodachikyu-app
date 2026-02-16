'use client';
import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getCountFromServer,
} from 'firebase/firestore';

const CATEGORIES = {
  daily: {
    label: '日常の選択',
    color: '#FFB74D',
    icon: '🚲',
    actions: [
      { id: 1, title: 'マイバッグを使う', detail: 'レジ袋を断って、自分のバッグを使おう！' },
      { id: 2, title: 'マイボトルを使う', detail: 'ペットボトルを減らして地球を冷やそう。' },
    ],
  },
  food: {
    label: 'たべもの',
    color: '#81C784',
    icon: '🍛',
    actions: [{ id: 4, title: '残さず食べる', detail: '外食でも残さず完食！残ったら持ち帰ろう。' }],
  },
  home: {
    label: '家の中',
    color: '#64B5F6',
    icon: '💡',
    actions: [{ id: 6, title: '電気を消す', detail: '部屋の電気はこまめにオフ！' }],
  },
  trash: {
    label: 'ごみ',
    color: '#BA68C8',
    icon: '♻️',
    actions: [{ id: 8, title: 'ゴミの分別', detail: '正しく分ければ資源に変わる。' }],
  },
};

export default function HomePage() {
  const [view, setView] = useState('home');
  const [selectedCat, setSelectedCat] = useState<keyof typeof CATEGORIES | null>(null);
  const [selectedAction, setSelectedAction] = useState<any>(null);
  const [isLanded, setIsLanded] = useState(false);
  const [actionCount, setActionCount] = useState(0);

  // 📊 Firestoreからアクション回数を取得
  const fetchActionCount = async () => {
    const user = auth.currentUser;
    if (user) {
      const q = query(collection(db, 'user_actions'), where('userId', '==', user.uid));
      const snapshot = await getCountFromServer(q);
      setActionCount(snapshot.data().count);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLanded(true);
      fetchActionCount();
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleCompleteAction = async () => {
    const user = auth.currentUser;
    if (user && db) {
      try {
        await addDoc(collection(db, 'user_actions'), {
          userId: user.uid,
          actionId: selectedAction?.id,
          actionTitle: selectedAction?.title,
          category: selectedCat,
          createdAt: serverTimestamp(),
        });
        await fetchActionCount();
        setView('success');
      } catch (error) {
        console.error('保存失敗:', error);
      }
    }
  };

  // 🌏 ちきゅまる表示（画像位置と成長ロジック修正済み）
  const Chikyumaru = ({ size: baseSize = 160 }) => {
    const isHappy = actionCount >= 5;
    const imageUrl = isHappy ? '/happy.jpg' : '/normal.jpg';
    const scale = Math.min(1 + actionCount * 0.02, 1.2);
    const finalSize = `${baseSize * scale}px`;

    return (
      <div
        style={{
          width: finalSize,
          height: finalSize,
          backgroundImage: `url("${imageUrl}")`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundColor: '#fff',
          borderRadius: '50%',
          border: isHappy ? '8px solid #FFEB3B' : '6px solid white',
          boxShadow: isHappy ? '0 0 30px rgba(255, 235, 59, 0.5)' : '0 10px 25px rgba(0,0,0,0.1)',
          animation: !isLanded ? 'dropIn 0.8s forwards' : 'float 4s ease-in-out infinite',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.5s ease',
        }}
      />
    );
  };

  return (
    <main style={containerStyle}>
      {/* 🏠 ホーム画面 */}
      {view === 'home' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ ...bubbleStyle, opacity: isLanded ? 1 : 0 }}>
            {actionCount >= 5
              ? 'ちきゅまるは とってもハッピー！'
              : `これまでに ${actionCount} 回\nがんばったね！`}
            <div style={bubbleTailStyle}></div>
          </div>
          <Chikyumaru />
          <button style={primaryButtonStyle(isLanded)} onClick={() => setView('category')}>
            今日のアクション
          </button>
        </div>
      )}

      {/* 📂 カテゴリ選択 */}
      {view === 'category' && (
        <div
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}
        >
          <h2 style={titleStyle}>カテゴリをえらぶ</h2>
          <div style={gridContainerStyle}>
            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <button
                key={key}
                style={tileButtonStyle(cat.color)}
                onClick={() => {
                  setSelectedCat(key as any);
                  setView('actions');
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>{cat.icon}</div>
                <div>{cat.label}</div>
              </button>
            ))}
          </div>
          <div style={{ marginTop: '30px' }}>
            <Chikyumaru size={100} />
          </div>
          <button style={backLinkStyle} onClick={() => setView('home')}>
            もどる
          </button>
        </div>
      )}

      {/* 📝 アクション一覧 */}
      {view === 'actions' && selectedCat && (
        <div
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}
        >
          <h2 style={titleStyle}>{CATEGORIES[selectedCat].label}</h2>
          <div style={actionListStyle}>
            {CATEGORIES[selectedCat].actions.map((action) => (
              <button
                key={action.id}
                style={actionItemStyle}
                onClick={() => {
                  setSelectedAction(action);
                  setView('detail');
                }}
              >
                {action.title}
              </button>
            ))}
          </div>
          <div style={{ marginTop: '30px' }}>
            <Chikyumaru size={100} />
          </div>
          <button style={backLinkStyle} onClick={() => setView('category')}>
            もどる
          </button>
        </div>
      )}

      {/* ℹ️ 詳細画面 */}
      {view === 'detail' && selectedAction && (
        <div
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}
        >
          <div style={detailCardStyle}>
            <h3 style={{ color: '#00796b', marginBottom: '15px' }}>{selectedAction.title}</h3>
            <p style={{ margin: '0 0 30px 0', lineHeight: '1.6', fontSize: '18px' }}>
              {selectedAction.detail}
            </p>
            <button
              style={{ ...primaryButtonStyle(true), width: '100%', marginTop: '0' }}
              onClick={handleCompleteAction}
            >
              できた！
            </button>
            <button style={backLinkStyle} onClick={() => setView('actions')}>
              もどる
            </button>
          </div>
          <div style={{ marginTop: '30px' }}>
            <Chikyumaru size={100} />
          </div>
        </div>
      )}

      {/* 🎉 達成画面 */}
      {view === 'success' && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <Chikyumaru />
          <h2 style={{ ...titleStyle, marginTop: '30px' }}>合計 {actionCount} 回達成！</h2>
          <p style={{ color: '#00695c', marginBottom: '40px' }}>
            {actionCount >= 5
              ? 'ちきゅまるが ぴかぴかになったよ！'
              : 'ちきゅまるが 元気になったよ！'}
          </p>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button style={secondaryButtonStyle} onClick={() => setView('home')}>
              ホームへ戻る
            </button>
            <button
              style={{ ...primaryButtonStyle(true), marginTop: 0 }}
              onClick={() => setView('category')}
            >
              続ける
            </button>
          </div>
        </div>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes dropIn { 0% { transform: translateY(-800px); } 100% { transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-15px) rotate(2deg); } }
      `,
        }}
      />
    </main>
  );
}

// スタイル定義（CSS-in-JS）
const containerStyle = {
  minHeight: '100vh',
  backgroundColor: '#e0f7fa',
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
  overflow: 'hidden',
};
const titleStyle = { color: '#00796b', marginBottom: '20px', fontWeight: 'bold' as const };
const gridContainerStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '15px',
  width: '100%',
  maxWidth: '320px',
};
const tileButtonStyle = (color: string) => ({
  backgroundColor: '#fff',
  border: 'none',
  borderBottom: `5px solid ${color}`,
  padding: '20px 10px',
  borderRadius: '20px',
  fontWeight: 'bold' as const,
  boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  cursor: 'pointer',
});
const primaryButtonStyle = (visible: boolean) => ({
  backgroundColor: '#48BB78',
  color: '#fff',
  padding: '16px 40px',
  borderRadius: '30px',
  border: 'none',
  fontSize: '20px',
  fontWeight: 'bold' as const,
  cursor: 'pointer',
  boxShadow: '0 6px 0 #2F855A',
  opacity: visible ? 1 : 0,
  transition: '0.5s 0.8s',
  marginTop: '40px',
});
const secondaryButtonStyle = {
  backgroundColor: '#fff',
  color: '#666',
  padding: '16px 20px',
  borderRadius: '15px',
  border: '2px solid #ddd',
  fontSize: '16px',
  fontWeight: 'bold' as const,
  cursor: 'pointer',
};
const bubbleStyle = {
  position: 'relative' as const,
  backgroundColor: '#fff',
  padding: '15px 25px',
  borderRadius: '25px',
  marginBottom: '20px',
  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  color: '#00796b',
  fontSize: '18px',
  fontWeight: 'bold' as const,
  transition: '0.5s 0.5s',
  textAlign: 'center' as const,
  whiteSpace: 'pre-wrap' as const,
};
const bubbleTailStyle = {
  position: 'absolute' as const,
  bottom: '-12px',
  left: '50%',
  transform: 'translateX(-50%)',
  borderLeft: '12px solid transparent',
  borderRight: '12px solid transparent',
  borderTop: '15px solid #fff',
};
const actionListStyle = {
  width: '100%',
  maxWidth: '320px',
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '12px',
};
const actionItemStyle = {
  backgroundColor: '#fff',
  border: 'none',
  padding: '18px',
  borderRadius: '15px',
  fontWeight: 'bold' as const,
  cursor: 'pointer',
  fontSize: '16px',
  textAlign: 'left' as const,
  boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
};
const backLinkStyle = {
  background: 'none',
  border: 'none',
  color: '#666',
  textDecoration: 'underline',
  marginTop: '20px',
  cursor: 'pointer',
  fontSize: '16px',
};
const detailCardStyle = {
  backgroundColor: '#fff',
  padding: '40px 30px',
  borderRadius: '30px',
  textAlign: 'center' as const,
  width: '320px',
  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
};
