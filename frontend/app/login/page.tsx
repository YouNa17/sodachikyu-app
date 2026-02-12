"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onLogin = async () => {
    // 未入力チェック（バリデーション）
    if (!email || !password) {
      setMsg("メールアドレスとパスワードを入力してください");
      return;
    }

    setLoading(true);
    setMsg(""); // メッセージをリセット

    try {
      // 1. Firebase認証を実行
      await signInWithEmailAndPassword(auth, email, password);
      
      // 2. 成功したら「カテゴリ一覧」へ遷移
      // ワイヤーフレームの「続けるを押したらカテゴリ一覧に遷移する」を実現
      router.push("/categories"); 
      
    } catch (e: any) {
      console.error(e);
      // エラーメッセージの日本語化
      if (e.code === "auth/invalid-credential") {
        setMsg("メールアドレスまたはパスワードが間違っています");
      } else if (e.code === "auth/invalid-email") {
        setMsg("メールアドレスの形式が正しくありません");
      } else {
        setMsg("ログインに失敗しました: " + e.code);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        padding: "40px 24px",
        display: "grid",
        gap: "16px",
        maxWidth: "400px",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <h1 style={{ marginBottom: "20px" }}>ログイン</h1>

      <input
        type="email"
        placeholder="メールアドレス"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ccc" }}
      />

      <input
        type="password"
        placeholder="パスワード"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ccc" }}
      />

      {/* エラーメッセージ表示エリア */}
      {msg && <p style={{ color: "red", fontSize: "14px", margin: "0" }}>{msg}</p>}

      <button
        onClick={onLogin}
        disabled={loading}
        style={{
          padding: "14px",
          backgroundColor: loading ? "#ccc" : "#4CAF50", // 地球キャラに合わせた緑系
          color: "white",
          border: "none",
          borderRadius: "25px",
          fontWeight: "bold",
          fontSize: "16px",
          cursor: loading ? "not-allowed" : "pointer",
          marginTop: "10px",
        }}
      >
        {loading ? "ログイン中..." : "ログイン"}
      </button>

      {/* 新規登録への導線（ログインボタンのすぐ下） */}
      <div style={{ marginTop: "10px" }}>
        <button
          onClick={() => router.push("/signup")}
          style={{
            background: "none",
            border: "none",
            color: "#0070f3",
            textDecoration: "underline",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          新規登録はこちら
        </button>
      </div>
    </main>
  );
}