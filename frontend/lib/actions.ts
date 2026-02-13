// lib/actions.ts
export const ACTIONS: Record<string, { id: number; title: string; detail: string }[]> = {
  waste: [
    { id: 1, title: "マイバッグを持ち歩く", detail: "レジ袋を断ることで、プラスチックごみを削減できます！" },
    { id: 2, title: "分別を徹底する", detail: "正しく分ければ、資源としてリサイクルされます。" },
  ],
  food: [
    { id: 3, title: "地産地消を心がける", detail: "輸送時のCO2を減らせて、新鮮な野菜も食べられます。" },
    { id: 4, title: "食品ロスをゼロに", detail: "残さず食べることは地球を守る第一歩です。" },
  ],
  energy: [
    { id: 5, title: "使わない電気を消す", detail: "こまめな消灯が節電の基本です！" },
  ],
  move: [
    { id: 6, title: "近い場所へは歩く", detail: "ガソリンを使わず、健康にも良い選択です。" },
  ],
  buy: [
    { id: 7, title: "長く使えるものを選ぶ", detail: "一つのものを大切に使うのが最大のエコです。" },
  ],
};