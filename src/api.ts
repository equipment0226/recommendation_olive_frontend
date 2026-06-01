import type { Analysis, RecOption, User, Validation } from "./types";

// 개발: Vite proxy → localhost:5000
// 프로덕션: VITE_API_BASE_URL 환경변수 (예: https://xxx.up.railway.app)
const BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "";

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(BASE + url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json() as Promise<T>;
}

export const api = {
  users: () => getJson<User[]>("/api/users"),
  analysis: (userId: string) => getJson<Analysis>(`/api/analysis/${userId}`),
  recommend: (userId: string) => getJson<RecOption[]>(`/api/recommend/${userId}`),
  validate: () => getJson<Validation>("/api/validate"),
};

// 카테고리/성분 기반 이모지 매핑 (썸네일 대용 — 화면설계서의 시각 톤 유지)
const CATEGORY_EMOJI: Record<string, string> = {
  스킨토너: "💧",
  에센스세럼: "🧪",
  크림: "🫙",
  클렌징폼: "🫧",
  선케어: "☀️",
  마스크팩: "🧖",
  샴푸: "🧴",
  트리트먼트: "💆",
  바디로션: "🧴",
  립밤: "💄",
  쿠션파운데이션: "🪞",
  아이섀도우: "🎨",
};

export function categoryEmoji(category?: string): string {
  if (!category) return "🧴";
  return CATEGORY_EMOJI[category] ?? "🧴";
}

export const recIcon: Record<string, { icon: string; bg: string }> = {
  cf: { icon: "👥", bg: "#e8f2ec" },
  trend: { icon: "📈", bg: "#fef3e2" },
  search: { icon: "🔍", bg: "#fce8ec" },
  repurchase: { icon: "🔄", bg: "#f0eaf8" },
  na: { icon: "🌿", bg: "#e8f2ec" },
};

export function won(price: number): string {
  return `₩${price.toLocaleString("ko-KR")}`;
}
