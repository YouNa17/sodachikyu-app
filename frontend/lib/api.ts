import { auth } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

function waitForUser(): Promise<User | null> {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user); // ← rejectしない
    });
  });
}

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  // ① まずcurrentUser確認
  let user = auth.currentUser;

  // ② なければ復元待ち
  if (!user) {
    user = await waitForUser();
  }

  // ③ それでも無ければ安全に終了
  if (!user) {
    console.warn('User not authenticated yet');
    return null;
  }

  // ④ トークン取得
  const token = await user.getIdToken();

  // ⑤ API呼び出し
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}
