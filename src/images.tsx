import { useEffect, useState } from "react";
import { categoryEmoji } from "./api";

// 개발: Vite proxy, 프로덕션: VITE_API_BASE_URL
const BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "";

// category_id → Pexels 이미지 URL 풀 (Promise 캐시)
const poolCache = new Map<string, Promise<string[]>>();
// category_id → (product_id → 풀 인덱스). 화면 내 중복 없이 순차 배정.
const assigned = new Map<string, Map<string, number>>();
const nextIndex = new Map<string, number>();

function fetchPool(categoryId: string): Promise<string[]> {
  let p = poolCache.get(categoryId);
  if (!p) {
    p = fetch(`${BASE}/api/images/${categoryId}`)
      .then((r) => (r.ok ? r.json() : { images: [] }))
      .then((d) => (d.images as string[]) ?? [])
      .catch(() => []);
    poolCache.set(categoryId, p);
  }
  return p;
}

function assignIndex(categoryId: string, productId: string): number {
  let m = assigned.get(categoryId);
  if (!m) {
    m = new Map();
    assigned.set(categoryId, m);
  }
  const existing = m.get(productId);
  if (existing !== undefined) return existing;
  const idx = nextIndex.get(categoryId) ?? 0;
  m.set(productId, idx);
  nextIndex.set(categoryId, idx + 1);
  return idx;
}

interface Props {
  categoryId?: string;
  productId: string;
  categoryName?: string;
  className?: string;
}

/**
 * 상품 썸네일 이미지. category_id 기반 Pexels 풀에서 화면 내 중복 없이 배정한다.
 * 로딩/실패 시 카테고리 이모지로 폴백.
 */
export function ProductImage({ categoryId, productId, categoryName, className }: Props) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    if (!categoryId) return;
    fetchPool(categoryId).then((pool) => {
      if (!active || pool.length === 0) return;
      const idx = assignIndex(categoryId, productId) % pool.length;
      setUrl(pool[idx]);
    });
    return () => {
      active = false;
    };
  }, [categoryId, productId]);

  if (!url) {
    return <span className={className}>{categoryEmoji(categoryName)}</span>;
  }
  return (
    <img
      className={className}
      src={url}
      alt={categoryName ?? "product"}
      loading="lazy"
      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
    />
  );
}
