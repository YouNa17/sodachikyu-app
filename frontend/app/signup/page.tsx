export default function LoginPage() {
  // ✨ useEffectを使わず、初期化時に一度だけ実行される関数を渡す
  const [stars] = useState(() => 
    [...Array(12)].map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3}s`,
    }))
  );

  // クライアントサイドでのみ描画するためのハイドレーション対策
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    // ...JSX...
  );
}