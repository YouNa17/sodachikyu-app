"use client";

import Link from "next/link";
import EarthCharacter from "@/components/EarthCharacter"; // さきほどのコンポーネントを読み込む

export default function HomePage() {
  // 本来はここでDBから取得しますが、今はテスト用に「3」を入れています
  const todayActionCount = 3;

  return (
    <main style={{ minHeight: "100vh", padding: "24px", background: "#F0F9FF" }}>
      {/* ヘッダーエリア */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h2 style={{ fontSize: "18px", margin: 0 }}>マイページ</h2>
        <Link href="/login" style={{ fontSize: "13px", color: "#666" }}>ログアウト</Link>
      </header>

      {/* 地球キャラコンポーネントを表示！ */}
      <section style={{ marginBottom: "30px" }}>
        <EarthCharacter clearedCount={todayActionCount} />
      </section>

      {/* アクション開始ボタン（ワイヤーフレームに基づいた配置） */}
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <button
          onClick={() => window.location.href = '/categories'}
          style={{
            width: "100%",
            maxWidth: "300px",
            padding: "18px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "35px",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(76, 175, 80, 0.3)"
          }}
        >
          アクションをはじめる
        </button>
      </div>

      {/* 今日のステータス（おまけ） */}
      <div style={{ marginTop: "40px", padding: "20px", background: "white", borderRadius: "16px", border: "1px solid #eaeaea" }}>
        <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
          現在のランク：<strong>エコ見習い</strong>
        </p>
      </div>
    </main>
  );
}