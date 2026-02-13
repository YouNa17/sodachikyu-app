"use client"; // [修正] useStateを使うために必須です

import Link from "next/link";
import { useState } from "react"; // [追加] setMsgを使うために必要です

// カテゴリデータ
const CATEGORIES = [
  { id: "waste", title: "ごみ・リサイクル", emoji: "🗑️", desc: "分別・減らす・リユース" },
  { id: "food", title: "食べもの", emoji: "🥕", desc: "残さず・地産地消" },
  { id: "energy", title: "電気・エネルギー", emoji: "💡", desc: "節電・待機電力カット" },
  { id: "move", title: "移動", emoji: "🚶", desc: "徒歩・自転車・公共交通" },
  { id: "buy", title: "買いもの", emoji: "🛍️", desc: "必要な分だけ・エコ商品" },
];

export default function CategoriesPage() {
  // [修正] メッセージを表示するための状態（State）
  const [msg, setMsg] = useState("");

  // ※ もし「ボタンを押して即クリア」という機能が必要なら使いますが、
  // この画面は「詳細（アクション一覧）へ飛ぶ」のが目的なので、LinkがあればOKです。

  return (
    <main style={{ minHeight: "100vh", padding: 20, background: "#F6FBFF" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <h1 style={{ margin: 0, fontSize: 20 }}>カテゴリ一覧</h1>
        <Link href="/home" style={{ fontSize: 13, color: "#0070f3" }}>
          ← ホーム
        </Link>
      </header>

      {/* メッセージ表示エリア */}
      {msg && (
        <div style={{ background: "#e8f5e9", padding: "10px", borderRadius: "8px", marginTop: "10px", fontSize: "14px" }}>
          {msg}
        </div>
      )}

      <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
        {CATEGORIES.map((c) => (
          <Link
            key={c.id}
            href={`/categories/${c.id}`} // 例: /categories/waste へ遷移
            style={{
              textDecoration: "none",
              color: "inherit",
              background: "white",
              border: "1px solid #eaeaea",
              borderRadius: 16,
              padding: 14,
              display: "flex",
              gap: 12,
              alignItems: "center",
              transition: "transform 0.1s",
            }}
          >
            <div style={{ width: 34, fontSize: 22 }}>{c.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700 }}>{c.title}</div>
              <div style={{ fontSize: 12, opacity: 0.75, marginTop: 4 }}>{c.desc}</div>
            </div>
            <div style={{ opacity: 0.5 }}>›</div>
          </Link>
        ))}
      </div>

     {/* 🌍 修正：ここに地球キャラを実物の画像で表示します */}
      <footer style={{ marginTop: "40px", textAlign: "center" }}>
        <img 
          src="/normal.jpg" 
          alt="地球キャラ" 
          style={{ width: "120px", height: "auto", marginBottom: "10px" }} 
        />
        <p style={{ fontSize: "14px", color: "#00796b", fontWeight: "bold", opacity: 0.8 }}>
          どのアクションからはじめる？
        </p>
      </footer>
    </main>
  );
}