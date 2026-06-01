import type { Analysis } from "../types";

interface Props {
  analysis: Analysis;
  onNext: () => void;
}

export function Step1({ analysis: a, onNext }: Props) {
  const tc = a.type_count;
  const cleanDesc = (["충동", "해결", "시즌"] as const)
    .filter((t) => tc[t])
    .map((t) =>
      t === "충동"
        ? `충동 ${tc[t]}`
        : t === "해결"
        ? `이미 해결된 니즈 ${tc[t]}`
        : `시즌 미스매치 ${tc[t]}`
    )
    .join(" · ");

  const gomin = a.keep_items.filter((i) => i.type === "고민").length;
  const bogwan = a.keep_items.filter((i) => i.type === "보관").length;

  return (
    <div className="fade-in">
      <div className="three-col" style={{ marginBottom: 22 }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "var(--coral-light)" }}>
            🛒
          </div>
          <div>
            <div className="stat-num" style={{ color: "var(--coral)" }}>
              {a.total_items}
            </div>
            <div className="stat-label">총 방치 상품</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "var(--amber-light)" }}>
            📅
          </div>
          <div>
            <div className="stat-num" style={{ color: "var(--amber)" }}>
              {a.avg_days}일
            </div>
            <div className="stat-label">평균 방치 기간</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "var(--sage-pale)" }}>
            🧹
          </div>
          <div>
            <div className="stat-num" style={{ color: "var(--olive)" }}>
              {a.cleansing_count}개
            </div>
            <div className="stat-label">클렌징 후보</div>
          </div>
        </div>
      </div>

      <div className="two-col">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="card">
            <div className="card-head" style={{ borderLeft: "4px solid var(--coral)" }}>
              <div>
                <div className="card-head-title">🗑️ 클렌징 추천 {a.cleansing_count}개</div>
                <div className="card-head-sub">{cleanDesc || "정리 후보 없음"}</div>
              </div>
              <span className="badge badge-충동">정리 필요</span>
            </div>
            <div style={{ padding: "12px 20px", fontSize: 12, color: "var(--text-soft)", lineHeight: 1.7 }}>
              구매 이력과 검색 데이터를 SQL 로 분석해 실제로 필요하지 않을 가능성이 높은
              상품을 골랐어요. 지울지 말지는 직접 결정해요.
            </div>
          </div>
          <div className="card">
            <div className="card-head" style={{ borderLeft: "4px solid var(--teal)" }}>
              <div>
                <div className="card-head-title">🤔 고민·보관 상품 {a.keep_count}개</div>
                <div className="card-head-sub">관심 신호 또는 반복 구매 이력이 있는 상품</div>
              </div>
              <span className="badge badge-고민">유지</span>
            </div>
            <div style={{ padding: "12px 20px", fontSize: 12, color: "var(--text-soft)", lineHeight: 1.7 }}>
              {gomin}개는 아직 살지 고민 중이고, {bogwan}개는 늘 쓰는 상품이에요.
            </div>
          </div>
        </div>

        <div className="sidebar">
          <div className="sidebar-head">
            <div className="sidebar-head-title">📊 분석 기반 데이터</div>
            <div className="sidebar-head-sub">어떤 데이터를 봤는지 알려드려요</div>
          </div>
          <div>
            <div className="sidebar-row">
              <span className="sidebar-row-label">🧹 클렌징 후보</span>
              <span className="sidebar-row-val" style={{ color: "var(--coral)" }}>
                {a.cleansing_count}개
              </span>
            </div>
            <div className="sidebar-row">
              <span className="sidebar-row-label">⚡ 충동 구매</span>
              <span className="sidebar-row-val" style={{ color: "var(--pink)" }}>
                {tc["충동"] ?? 0}개
              </span>
            </div>
            <div className="sidebar-row">
              <span className="sidebar-row-label">✅ 니즈 해결</span>
              <span className="sidebar-row-val" style={{ color: "var(--coral)" }}>
                {tc["해결"] ?? 0}개
              </span>
            </div>
            <div className="sidebar-row">
              <span className="sidebar-row-label">🌸 시즌 미스매치</span>
              <span className="sidebar-row-val" style={{ color: "var(--purple)" }}>
                {tc["시즌"] ?? 0}개
              </span>
            </div>
          </div>
          <div className="sidebar-footer">
            <div className="info-banner green" style={{ margin: 0 }}>
              "사게 만드는 것"이 아니라 <strong>"제대로 사게 만드는 것"</strong>을 목표로 해요
            </div>
            <button className="btn btn-primary btn-full btn-lg" onClick={onNext}>
              클렌징 시작하기 →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
