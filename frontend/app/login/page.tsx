"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
　const router = useRouter();

  const onLogin = async () => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setMsg("ログイン成功 uid: " + result.user.uid);
      router.push("/home");
    } catch (e: any) {
      console.error(e);
      setMsg("ログイン失敗: " + e.code);
    }
  };

  return (
    <main
      style={{
        padding: 24,
        display: "grid",
        gap: 12,
        maxWidth: 420,
      }}
    >
      <h1>ログイン</h1>

      <input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ padding: 10 }}
      />

      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ padding: 10 }}
      />

      <button onClick={onLogin} style={{ padding: 10 }}>
        ログイン
      </button>

      {msg && <p>{msg}</p>}
    </main>
  );
}
