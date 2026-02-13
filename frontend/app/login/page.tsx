"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onLogin = async () => {
    if (!email || !password) {
      setMsg("メールアドレスとパスワードを入力してください");
      return;
    }

    setLoading(true);
    setMsg(""); 

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const allowedEmails = process.env.NEXT_PUBLIC_ALLOWED_EMAILS?.split(",") || [];
      
      if (!allowedEmails.includes(result.user.email || "")) {
        setMsg("アドレスが正しくないです。");
        await signOut(auth); 
        return; 
      }

      router.push("/home"); // 🏠 地球のページへ
      
    } catch (e: any) {
      setMsg("ログインに失敗しました。パスワード等を確認してください。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: "40px 24px", textAlign: "center", maxWidth: "400px", margin: "0 auto" }}>
      <h1>ログイン</h1>
      <input type="email" placeholder="メールアドレス" value={email} onChange={(e) => setEmail(e.target.value)} style={{ display: "block", width: "100%", padding: "12px", margin: "10px 0", borderRadius: "8px", border: "1px solid #ccc" }} />
      <input type="password" placeholder="パスワード" value={password} onChange={(e) => setPassword(e.target.value)} style={{ display: "block", width: "100%", padding: "12px", margin: "10px 0", borderRadius: "8px", border: "1px solid #ccc" }} />
      {msg && <p style={{ color: "red" }}>{msg}</p>}
      <button onClick={onLogin} disabled={loading} style={{ width: "100%", padding: "14px", backgroundColor: "#4CAF50", color: "white", borderRadius: "25px", border: "none", fontWeight: "bold", cursor: "pointer" }}>
        {loading ? "ログイン中..." : "ログイン"}
      </button>
    </main>
  );
}