"use client";

import { useParams, useRouter } from "next/navigation";

// ダミーデータ（本来はDBやAPIから取得します）
const ACTIONS: Record<string, any[]> = {
  waste: [
    { id: 1, text: "マイバッグを使った" },
    { id: 2, text: "ペットボトルのラベルを剥がした" },
  ],
  food: [
    { id: 3, text: "食べ残しゼロ！" },
    { id: 4, text: "地元の野菜を買った" },
  ],
};

export default function ActionListPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;
  const actions = ACTIONS[categoryId] || [];

  return (
    <main style={{ padding: 20 }}>
      <button onClick={() => router.back()} style={{ border: "none", background: "none", color: "#0070f3" }}>
        ← 戻る
      </button>
      
      <h1 style={{ fontSize: 24, marginTop: 10 }}>できること一覧</h1>
      <p style={{ color: "#666" }}>カテゴリ: {categoryId}</p>

      <div style={{ display: "grid", gap: 12, marginTop: 20 }}>
        {actions.map((action) => (
          <div 
            key={action.id}
            style={{ padding: 16, background: "#fff", border: "1px solid #ddd", borderRadius: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}
          >
            <span>{action.text}</span>
            <button 
              onClick={() => alert("ナイス！")}
              style={{ padding: "8px 16px", borderRadius: 20, border: "none", backgroundColor: "#4CAF50", color: "#white" }}
            >
              できた！
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}