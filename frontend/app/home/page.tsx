"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function HomePage() {
  const router = useRouter();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const savedCount = localStorage.getItem("actionCount");
    setCount(savedCount ? parseInt(savedCount) : 0);
  }, []);

  // ✅ 指摘通り定義を整理。実際のファイル名に合わせて .png.jpg に修正
  const earthImage = count >= 5 ? "/earth-happy.png.jpg" : "/earth-normal.png.jpg";

  return (
    <main style={{ padding: "40px 20px", textAlign: "center", backgroundColor: "#e0f7fa", minHeight: "100vh" }}>
      <h1 style={{ color: "#00796b", fontSize: "28px" }}>わたしの地球</h1>
      <p style={{ marginBottom: "30px" }}>これまでのアクション: {count}回</p>
      
      <div className="floating-earth" style={{ margin: "40px 0" }}>
        <img src={earthImage} alt="地球" style={{ width: "200px", height: "auto" }} />
      </div>

      <button 
        onClick={() => router.push("/categories")} 
        style={{ padding: "16px 40px", backgroundColor: "#4CAF50", color: "white", borderRadius: "30px", border: "none", fontWeight: "bold", fontSize: "18px", cursor: "pointer" }}
      >
        アクションをはじめる
      </button>

      <style jsx>{`
        .floating-earth { animation: float 3s ease-in-out infinite; }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </main>
  );
}