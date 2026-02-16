'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const ACTION_DATA: Record<
  string,
  { title: string; actions: { id: string; label: string; detail: string }[] }
> = {
  daily: {
    title: '日常の選択',
    actions: [
      {
        id: 'd1',
        label: 'マイバッグを使う',
        detail: 'プラスチックごみを減らし、石油資源の節約になります。',
      },
      {
        id: 'd2',
        label: 'マイボトルを使う',
        detail: 'ペットボトルの廃棄を抑え、製造時のCO2排出を削減します。',
      },
      {
        id: 'd3',
        label: 'リユースを選ぶ',
        detail: '中古品を選んだり譲ったりして、製品の寿命を延ばします。',
      },
      {
        id: 'd4',
        label: '使い捨てを断る',
        detail: '不要な箸やスプーンをもらわず、ゴミを削減します。',
      },
      { id: 'd5', label: '歩き・自転車・公共交通', detail: '排気ガスによる環境負荷を減らします。' },
    ],
  },
  food: {
    title: '食べ物',
    actions: [
      {
        id: 'f1',
        label: '外食で残さず食べる',
        detail: '食品ロスを減らし、廃棄時のエネルギーを抑えます。',
      },
      {
        id: 'f2',
        label: 'てまえどりをする',
        detail: '棚の手前から取ることで食品ロス削減に貢献します。',
      },
      {
        id: 'f3',
        label: '規格外・見切り品を選ぶ',
        detail: 'まだ食べられる食品が捨てられるのを防ぎます。',
      },
      {
        id: 'f4',
        label: '必要な分だけ買う',
        detail: '予定外の買い物を控え、無駄な廃棄をなくします。',
      },
      { id: 'f5', label: '近くの産地のものを選ぶ', detail: '輸送にかかる燃料を削減できます。' },
    ],
  },
  home: {
    title: '家の中',
    actions: [
      {
        id: 'h1',
        label: '使ってない電気を消す',
        detail: '無駄な電力消費を抑え、CO2排出を抑制します. ',
      },
      { id: 'h2', label: 'エアコン温度の調整', detail: '1度調整で消費電力を約10%削減できます。' },
      { id: 'h3', label: 'コンセントを抜く', detail: '待機電力をカットして消費電力を削減します。' },
      {
        id: 'h4',
        label: '残り湯を洗濯に使う',
        detail: '1回あたり約45〜65リットルの節水になります。',
      },
      {
        id: 'h5',
        label: '冷蔵庫の中を整理する',
        detail: '冷却効率がアップし、電気の無駄を省きます。',
      },
    ],
  },
  waste: {
    title: 'ごみ',
    actions: [
      {
        id: 'w1',
        label: '資源ごみをリサイクル',
        detail: '適切な回収場所へ持ち込み、資源を循環させます。',
      },
      { id: 'w2', label: 'ゴミを正しく分別する', detail: '再利用可能な資源を無駄にしません。' },
      { id: 'w3', label: '生ゴミの水を切る', detail: '焼却時のエネルギー効率を高めます。' },
    ],
  },
};

export default function ActionListPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;
  const data = ACTION_DATA[categoryId] || ACTION_DATA.daily;

  const [selectedAction, setSelectedAction] = useState<{ label: string; detail: string } | null>(
    null,
  );
  const [isFinished, setIsFinished] = useState(false);
  const [currentCount, setCurrentCount] = useState(0);

  useEffect(() => {
    const savedCount = localStorage.getItem('actionCount');
    setCurrentCount(savedCount ? parseInt(savedCount) : 0);
  }, []);

  const handleDone = () => {
    const newCount = currentCount + 1;
    setCurrentCount(newCount);
    localStorage.setItem('actionCount', newCount.toString());
    localStorage.setItem('lastActionTitle', selectedAction?.label || '');
    setIsFinished(true);
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

      <h1 style={{ textAlign: 'center', color: '#2F855A' }}>{data.title}</h1>
      <div style={{ display: 'grid', gap: '15px', marginTop: '20px' }}>
        {data.actions.map((a) => (
          <button
            key={a.id}
            onClick={() => setSelectedAction(a)}
            style={{
              padding: '18px',
              borderRadius: '16px',
              border: '1px solid #ddd',
              backgroundColor: 'white',
              textAlign: 'left',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            {a.label}
          </button>
        ))}
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
            <h2>{selectedAction.label}</h2>
            <p style={{ margin: '20px 0', textAlign: 'left' }}>{selectedAction.detail}</p>
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
              padding: '15px 25px',
              borderRadius: '20px',
              marginBottom: '20px',
              border: '2px solid #4299E1',
              fontWeight: 'bold',
            }}
          >
            {selectedAction?.label.includes('湯') || selectedAction?.label.includes('水')
              ? 'あ〜極楽極楽…🌍♨️'
              : 'ナイスアクション！🌱'}
          </div>
          <img
            src={
              selectedAction?.label.includes('湯') || selectedAction?.label.includes('水')
                ? '/ohuro.jpg'
                : '/normal.jpg'
            }
            style={{ width: '200px', borderRadius: '50%', border: '4px solid #48BB78' }}
          />
          <h2 style={{ marginTop: '20px' }}>{currentCount}回目のアクション！</h2>
          <div style={{ display: 'grid', gap: '10px', marginTop: '30px', width: '250px' }}>
            <button
              onClick={() => {
                setIsFinished(false);
                setSelectedAction(null);
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
