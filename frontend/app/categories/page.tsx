import Link from "next/link";
import { addClear } from "@/lib/progress";


function onDo(title: string) {
  const cleared = addClear(); // ←これが増やして保存
  setMsg(`✅ 「${title}」クリア！ きょうの行動：${cleared} 回`);
  setTimeout(() => setMsg(""), 2500);
}


const cleared = addClear();

const CATEGORIES = [
  { id: "waste", title: "ごみ・リサイクル", emoji: "🗑️", desc: "分別・減らす・リユース" },
  { id: "food", title: "食べもの", emoji: "🥕", desc: "残さず・地産地消" },
  { id: "energy", title: "電気・エネルギー", emoji: "💡", desc: "節電・待機電力カット" },
  { id: "move", title: "移動", emoji: "🚶", desc: "徒歩・自転車・公共交通" },
  { id: "buy", title: "買いもの", emoji: "🛍️", desc: "必要な分だけ・エコ商品" },
];

export default function CategoriesPage() {
  return (
    <main style={{ minHeight: "100vh", padding: 20, background: "#F6FBFF" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <h1 style={{ margin: 0, fontSize: 20 }}>カテゴリ一覧</h1>
        <Link href="/home" style={{ fontSize: 13 }}>
          ← ホーム
        </Link>
      </header>

      <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
        {CATEGORIES.map((c) => (
          <Link
            key={c.id}
            href={`/categories/${c.id}`}
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
    </main>
  );
}
