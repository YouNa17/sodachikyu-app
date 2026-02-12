"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<{ type: "ok" | "ng"; text: string } | null>(
    null
  );

  const onLogin = async () => {
    setMsg(null);

    // 簡易バリデーション（デモ用）
    if (!email.includes("@")) {
      setMsg({ type: "ng", text: "メールアドレスの形式が正しくありません" });
      return;
    }
    if (password.length < 6) {
      setMsg({ type: "ng", text: "パスワードは6文字以上にしてください" });
      return;
    }

    // ✅ いまはモック
    setMsg({ type: "ok", text: "（いまはモック）ログインできた想定です" });

    // TODO: Firebaseに切り替える時はここを差し替え
    // signInWithEmailAndPassword(auth, email, password)
    // 成功したら router.push("/home") など
  };

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <section
        style={{
          width: "min(520px, 92vw)",
          padding: 24,
          border: "1px solid #eee",
          borderRadius: 16,
          display: "grid",
          gap: 14,
        }}
      >
        <header style={{ display: "grid", gap: 6 }}>
          <h1 style={{ margin: 0, fontSize: 22 }}>ログイン</h1>
          <p style={{ margin: 0, opacity: 0.7 }}>
            メールアドレスとパスワードを入力してください
          </p>
        </header>

        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 12, opacity: 0.8 }}>メール</span>
          <input
            type="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: 12,
              borderRadius: 12,
              border: "1px solid #ddd",
            }}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 12, opacity: 0.8 }}>パスワード</span>
          <input
            type="password"
            placeholder="6文字以上"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: 12,
              borderRadius: 12,
              border: "1px solid #ddd",
            }}
          />
        </label>

        <button
          onClick={onLogin}
          style={{
            padding: 12,
            borderRadius: 12,
            border: "1px solid #111",
            background: "white",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          ログイン
        </button>

        {msg && (
          <p
            style={{
              margin: 0,
              padding: 12,
              borderRadius: 12,
              border: "1px solid #eee",
              background: msg.type === "ok" ? "#f4fff7" : "#fff4f4",
            }}
          >
            {msg.text}
          </p>
        )}

        <footer style={{ display: "flex", gap: 8, fontSize: 14 }}>
          <span>はじめての方は</span>
          <Link href="/signup">新規登録</Link>
        </footer>
      </section>
    </main>
  );
}
