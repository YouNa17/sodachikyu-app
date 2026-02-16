'use client';
// ...インポート類...

// 🌏 1. Chikyumaruコンポーネントを関数の外側に移動
// 必要なデータ（actionCount, isLanded）は引数（Props）として受け取ります
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
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        margin: '0 auto',
        transition: 'all 0.5s ease',
        // animation: isLanded ? 'jumpUp 0.8s' : 'poyon 3s infinite', // 必要に応じてPropsで渡す
      }}
    />
  );
};

export default function HomePage() {
  const [actionCount, setActionCount] = useState(0);
  // ...他のステート...

  return (
    <main style={containerStyle}>
      {/* 🌏 2. 使うときは Props を渡す */}
      <Chikyumaru actionCount={actionCount} />

      {/* 別の場所で使うとき */}
      <Chikyumaru size={100} actionCount={actionCount} />

      {/* ...残りのコード... */}
    </main>
  );
}
