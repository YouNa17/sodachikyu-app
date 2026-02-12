"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // [追加] 遷移用
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false); // [追加] 二重押し防止
  const router = useRouter();

  const onSignup = async () => {
    // 未入力チェック
    if (!email || !password) {
      setMsg("メールアドレスとパスワードを入力してください");
      return;
    }
    
    // パスワードの長さチェック
    if (password.length < 6) {
      setMsg("パスワードは6文字以上で入力してください");
      return;
    }

    setLoading(true);
    setMsg("");

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      setMsg("登録成功！");
      
      // ✅ 登録成功後、自動的にカテゴリ一覧へ遷移
      router.push("/categories");
      
    } catch (e: any) {
      console.error(e);
      // エラーメッセージの日本語化
      if (e.code === "auth/email-already-in-use") {
        setMsg("このメールアドレスは既に登録されています");
      } else if (e.code === "auth/invalid-email") {
        setMsg("メールアドレスの形式が正しくありません");
      } else {
        setMsg("登録に失敗しました: " + e.code);
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
      <h1 style={{ marginBottom: "20px" }}>新規登録</h1>

      <input
        type="email"
        placeholder="メールアドレス"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ccc" }}
      />

      <input
        type="password"
        placeholder="パスワード（6文字以上）"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ccc" }}
      />

      {msg && <p style={{ color: "red", fontSize: "14px", margin: "0" }}>{msg}</p>}

      <button
        onClick={onSignup}
        disabled={loading}
        style={{
          padding: "14px",
          backgroundColor: loading ? "#ccc" : "#4CAF50", // 地球キャラカラー
          color: "white",
          border: "none",
          borderRadius: "25px",
          fontWeight: "bold",
          fontSize: "16px",
          cursor: loading ? "not-allowed" : "pointer",
          marginTop: "10px",
        }}
      >
        {loading ? "登録中..." : "登録する"}
      </button>

      {/* 戻る導線 */}
      <div style={{ marginTop: "10px" }}>
        <button
          onClick={() => router.push("/login")}
          style={{
            background: "none",
            border: "none",
            color: "#666",
            textDecoration: "underline",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          ログイン画面に戻る
        </button>
      </div>
    </main>
  );
}