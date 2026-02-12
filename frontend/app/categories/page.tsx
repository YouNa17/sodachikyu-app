import Link from "next/link";

const CATEGORIES = [
  { id: "waste", title: "ごみ・リサイクル", emoji: "🗑️" },
  { id: "food", title: "食べもの", emoji: "🥕" },
  { id: "energy", title: "電気・エネルギー", emoji: "💡" },
  { id: "move", title: "移動", emoji: "🚶" },
  { id: "buy", title: "買いもの", emoji: "🛍️" },
];

export default function CategoriesPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>カテゴリ一覧</h1>
      <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
        {CATEGORIES.map((c) => (
          <Link key={c.id} href={`/categories/${c.id}`} style={{ textDecoration: "none" }}>
            <div
              style={{
                border: "1px solid #eee",
                borderRadius: 14,
                padding: 14,
                display: "flex",
                gap: 10,
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 20 }}>{c.emoji}</span>
              <span style={{ fontWeight: 700, color: "#111" }}>{c.title}</span>
            </div>
          </Link>
        ))}
      </div>

      <p style={{ marginTop: 18 }}>
        <Link href="/home">← 戻る</Link>
      </p>
    </main>
  );
}
