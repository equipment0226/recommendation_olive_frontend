import { useEffect, useState } from "react";
import { api } from "../api";
import type { Distribution } from "../types";

export function Validate() {
  const [data, setData] = useState<Distribution | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    api.distribution().then(setData).catch((e) => setErr(String(e)));
  }, []);

  if (err) return <div className="empty">불러오기 실패: {err}</div>;
  if (!data) return <div className="loading">집계 중…</div>;

  const cleansingPct = data.total
    ? Math.round((data.cleansing_total / data.total) * 100)
    : 0;
  const ring = `conic-gradient(var(--coral) ${cleansingPct}%, var(--olive-light) 0)`;
  const buckets = Object.entries(data.by_bucket).sort(
    (a, b) => b[1].count - a[1].count,
  );

  return (
    <div className="fade-in">
      <div className="card" style={{ marginBottom: 22 }}>
        <div className="card-head">
          <div>
            <div className="card-head-title">📊 버킷 분포</div>
            <div className="card-head-sub">
              조회 시점에 SQL CASE 로 실시간 판별 — 별도 정답 라벨 없이 판별 로직 자체가 정답
            </div>
          </div>
          <span className="badge badge-고민">실시간 분류</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 32, padding: "24px 28px" }}>
          <div className="donut" style={{ background: ring }}>
            <div className="donut-inner">
              <div className="donut-num">{cleansingPct}%</div>
              <div className="donut-label">클렌징 비중</div>
            </div>
          </div>
          <div className="val-grid" style={{ flex: 1, marginBottom: 0, gridTemplateColumns: "repeat(3,1fr)" }}>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: "var(--sage-pale)" }}>📦</div>
              <div>
                <div className="stat-num" style={{ color: "var(--olive)" }}>{data.total}</div>
                <div className="stat-label">전체 방치 상품</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: "var(--coral-light)" }}>🧹</div>
              <div>
                <div className="stat-num" style={{ color: "var(--coral)" }}>{data.cleansing_total}</div>
                <div className="stat-label">클렌징 제안</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: "var(--sage-pale)" }}>📌</div>
              <div>
                <div className="stat-num" style={{ color: "var(--teal)" }}>{data.keep_total}</div>
                <div className="stat-label">유지</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-head-title">버킷별 분포</div>
            <div className="card-head-sub">
              방치 유저 {data.users}명 · 상품 {data.total}개 기준
            </div>
          </div>
        </div>
        <table className="val-table">
          <thead>
            <tr>
              <th>버킷</th>
              <th>그룹</th>
              <th>개수</th>
              <th>비율</th>
            </tr>
          </thead>
          <tbody>
            {buckets.map(([name, s]) => (
              <tr key={name}>
                <td style={{ fontWeight: 600 }}>{name}</td>
                <td>
                  <span className={`val-pill ${s.group === "cleansing" ? "no" : "ok"}`}>
                    {s.group === "cleansing" ? "클렌징" : "유지"}
                  </span>
                </td>
                <td className="mono">{s.count}</td>
                <td>
                  <div>{s.ratio}%</div>
                  <div className="val-bar-wrap">
                    <div className="val-bar" style={{ width: `${s.ratio}%` }} />
                  </div>
                </td>
              </tr>
            ))}
            {buckets.length === 0 && (
              <tr>
                <td colSpan={4} className="empty">
                  방치 상품이 없습니다
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
