import { useEffect, useState } from "react";
import { api } from "../api";
import type { Validation } from "../types";

export function Validate() {
  const [data, setData] = useState<Validation | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    api.validate().then(setData).catch((e) => setErr(String(e)));
  }, []);

  if (err) return <div className="empty">불러오기 실패: {err}</div>;
  if (!data) return <div className="loading">검증 중…</div>;

  const ring = `conic-gradient(var(--olive-light) ${data.match_rate}%, var(--border) 0)`;
  const buckets = Object.entries(data.by_bucket).sort((a, b) => b[1].total - a[1].total);

  return (
    <div className="fade-in">
      <div className="card" style={{ marginBottom: 22 }}>
        <div className="card-head">
          <div>
            <div className="card-head-title">🔍 분류 로직 검증</div>
            <div className="card-head-sub">
              SQL 분류 결과 vs cart_items.expected_bucket (기획서 정답값) 대조
            </div>
          </div>
          <span className="badge badge-고민">정합성 테스트</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 32, padding: "24px 28px" }}>
          <div className="donut" style={{ background: ring }}>
            <div className="donut-inner">
              <div className="donut-num">{data.match_rate}%</div>
              <div className="donut-label">일치율</div>
            </div>
          </div>
          <div className="val-grid" style={{ flex: 1, marginBottom: 0, gridTemplateColumns: "repeat(3,1fr)" }}>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: "var(--sage-pale)" }}>📦</div>
              <div>
                <div className="stat-num" style={{ color: "var(--olive)" }}>{data.total}</div>
                <div className="stat-label">전체 대상</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: "var(--sage-pale)" }}>✅</div>
              <div>
                <div className="stat-num" style={{ color: "var(--teal)" }}>{data.correct}</div>
                <div className="stat-label">일치</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: "var(--coral-light)" }}>⚠️</div>
              <div>
                <div className="stat-num" style={{ color: "var(--coral)" }}>
                  {data.total - data.correct}
                </div>
                <div className="stat-label">불일치</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="two-col">
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-head-title">버킷별 정확도</div>
              <div className="card-head-sub">expected_bucket 기준 그룹별 일치율</div>
            </div>
          </div>
          <table className="val-table">
            <thead>
              <tr>
                <th>정답 버킷</th>
                <th>일치/전체</th>
                <th>정확도</th>
              </tr>
            </thead>
            <tbody>
              {buckets.map(([name, s]) => (
                <tr key={name}>
                  <td style={{ fontWeight: 600 }}>{name}</td>
                  <td className="mono">
                    {s.correct} / {s.total}
                  </td>
                  <td>
                    <div>{s.rate}%</div>
                    <div className="val-bar-wrap">
                      <div className="val-bar" style={{ width: `${s.rate}%` }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-head-title">불일치 케이스 ({data.mismatches.length})</div>
              <div className="card-head-sub">다중 조건이 겹친 경계 사례</div>
            </div>
          </div>
          <table className="val-table">
            <thead>
              <tr>
                <th>유저</th>
                <th>정답</th>
                <th>예측</th>
              </tr>
            </thead>
            <tbody>
              {data.mismatches.map((m) => (
                <tr key={m.user_id + m.product_id}>
                  <td className="mono">{m.user_id}</td>
                  <td>
                    <span className="val-pill ok">{m.expected}</span>
                  </td>
                  <td>
                    <span className="val-pill no">{m.predicted}</span>
                  </td>
                </tr>
              ))}
              {data.mismatches.length === 0 && (
                <tr>
                  <td colSpan={3} className="empty">
                    완벽 일치 🎉
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
