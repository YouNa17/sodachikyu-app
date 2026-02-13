"use client";

import Image from "next/image"; // [追加] 画像表示用

type Props = {
  clearedCount: number;
};

export default function EarthCharacter({ clearedCount }: Props) {
  // 表情レベルの判定ロジックはそのまま活用！
  const level =
    clearedCount >= 5 ? 3 :
    clearedCount >= 1 ? 2 :
    1;

  // [変更] レベルに応じて画像ファイルを切り替えることも可能です
  // 例: level1 = 😐.png, level2 = 🙂.png, level3 = 😄.png
  // 今は一旦 1枚の画像で進める想定にします。
  const characterImagePath = "/earth_character.png"; 

  const message =
    level === 3
      ? "ちきゅうがとっても嬉しそう！"
      : level === 2
      ? "いいね！ちきゅうが元気になってきたよ"
      : "きょうはまだこれからだね";

  return (
    <section
      style={{
    background: "white",
    borderRadius: 16,
    padding: 24,             // 余白を少し広げます ↕️
    border: "1px solid #eaeaea",
    display: "flex",
    flexDirection: "column", // 横並びから「縦並び」に変更 ↕️
    alignItems: "center",    // 「中央寄せ」に設定 🎯
    gap: 16,                 // 画像と文字の間の距離 📏
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
  }}
    >
      <div
        style={{
          width: 400, // 画像に合わせて少し調整
          height: 400,
          borderRadius: 18,
          background: "#E7F6FF",
          display: "grid",
          placeItems: "center",
          position: "relative", // 絵文字を重ねる場合に必要
        }}
      >
        {/* メインのキャラ画像 */}
        <Image 
          src={characterImagePath} 
          alt="地球キャラ" 
          width={400} 
          height={400} 
          style={{ objectFit: "contain" }}
        />
        
        {/* 表情の変化を絵文字で表現（画像の上に重ねる） */}
        <span style={{ 
          position: "absolute", 
          bottom: 5, 
          right: 5, 
          fontSize: 20,
          background: "white",
          borderRadius: "50%",
          padding: "2px"
        }}>
          {level === 3 ? "😄" : level === 2 ? "🙂" : "😐"}
        </span>
      </div>

      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontWeight: 700 }}>
          きょうの地球
        </p>

        <p style={{ margin: "6px 0 0", fontSize: 13, opacity: 0.75 }}>
          {message}
        </p>

        <p style={{ margin: "8px 0 0", fontSize: 12, opacity: 0.6 }}>
          今日の行動：{clearedCount} 回
        </p>
      </div>
    </section>
  );
}