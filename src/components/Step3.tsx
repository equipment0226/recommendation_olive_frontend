import { useState } from "react";
import { categoryEmoji, recIcon } from "../api";
import type { RecOption } from "../types";

interface Props {
  options: RecOption[];
  checkedCount: number;
  remaining: number;
  loading: boolean;
  onDone: () => void;
}

export function Step3({ options, checkedCount, remaining, loading, onDone }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const active = options.find((o) => o.id === selected) ?? null;
  const valid = options.filter((o) => o.id !== "na" && o.items.length > 0);

  return (
    <div className="fade-in">
      <div
        style={{
          background: "var(--sage-pale)",
          border: "1px solid #c0dcc8",
          borderRadius: 12,
          padding: "14px 22px",
          marginBottom: 22,
          display: "flex",
          gap: 14,
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: 28 }}>✅</div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--olive)" }}>
            {checkedCount}개 상품 정리 완료!
          </div>
          <div style={{ fontSize: 12, color: "var(--text-soft)", marginTop: 2 }}>
            장바구니가 깔끔해졌어요. 이제 뭘 보여드릴까요?
          </div>
        </div>
      </div>

      <div className="two-col">
        <div>
          {loading ? (
            <div className="loading">추천을 준비하고 있어요…</div>
          ) : !active ? (
            <>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>
                원하는 추천을 골라보세요
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {valid.map((opt) => {
                  const ic = recIcon[opt.id] ?? recIcon.na;
                  return (
                    <div
                      className="rec-card"
                      key={opt.id}
                      onClick={() => setSelected(opt.id)}
                    >
                      <div className="rec-icon" style={{ background: ic.bg }}>
                        {ic.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div className="rec-title">{opt.title}</div>
                        <div className="rec-desc">{opt.desc}</div>
                        <span className="rec-algo">{opt.algo}</span>
                      </div>
                      <div className="rec-arrow">›</div>
                    </div>
                  );
                })}
              </div>
              {valid.length === 0 && (
                <div className="empty">표시할 추천이 없어요. 완료로 넘어가세요.</div>
              )}
              <div style={{ marginTop: 14, textAlign: "center" }}>
                <button className="btn btn-outline" onClick={onDone}>
                  괜찮아요, 완료할게요
                </button>
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 14,
                }}
              >
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{active.result_title}</div>
                  <div style={{ fontSize: 12, color: "var(--text-soft)", marginTop: 2 }}>
                    {active.result_sub}
                  </div>
                </div>
                <button className="btn btn-outline btn-sm" onClick={() => setSelected(null)}>
                  ← 다른 추천 보기
                </button>
              </div>
              <div className="rec-grid">
                {active.items.map((p) => (
                  <div className="rec-product" key={p.product_id}>
                    <div className="rec-product-img">{categoryEmoji()}</div>
                    <div className="rec-product-body">
                      <div className="rec-product-brand">{p.brand}</div>
                      <div className="rec-product-name">{p.name}</div>
                      <div className="rec-product-price">{p.price}</div>
                      <span className="rec-product-tag">{p.tag}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="sidebar">
          <div className="sidebar-head">
            <div className="sidebar-head-title">🌿 이번 분석 결과</div>
            <div className="sidebar-head-sub">정리 내역</div>
          </div>
          <div>
            <div className="sidebar-row">
              <span className="sidebar-row-label">🗑️ 정리한 상품</span>
              <span className="sidebar-row-val" style={{ color: "var(--coral)" }}>
                {checkedCount}개
              </span>
            </div>
            <div className="sidebar-row">
              <span className="sidebar-row-label">✅ 남은 상품</span>
              <span className="sidebar-row-val" style={{ color: "var(--olive)" }}>
                {remaining}개
              </span>
            </div>
          </div>
          <div className="sidebar-footer">
            <div className="info-banner green" style={{ margin: 0 }}>
              추천 신뢰가 쌓일수록 더 잘 맞는 상품을 보여드릴게요 🌿
            </div>
            <button className="btn btn-primary btn-full btn-lg" onClick={onDone}>
              🎉 분석 완료
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
