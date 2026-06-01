interface Props {
  userId: string;
  cleaned: number;
  remaining: number;
  onRestart: () => void;
}

export function Done({ userId, cleaned, remaining, onRestart }: Props) {
  return (
    <div className="fade-in">
      <div className="done-banner">
        <div className="done-icon-big">🌿</div>
        <div>
          <div className="done-title">장바구니 정리 완료!</div>
          <div className="done-desc">
            불필요한 상품 {cleaned}개를 정리하고 필요한 상품만 남겼어요.
            <br />
            추천 신뢰가 쌓일수록 {userId}님에게 더 잘 맞는 상품을 보여드릴게요.
          </div>
          <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
            <button className="btn btn-secondary btn-lg" onClick={onRestart}>
              처음부터 다시보기
            </button>
          </div>
        </div>
      </div>
      <div className="three-col">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "var(--coral-light)" }}>
            🗑️
          </div>
          <div>
            <div className="stat-num" style={{ color: "var(--coral)" }}>
              {cleaned}개
            </div>
            <div className="stat-label">정리한 상품</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "var(--sage-pale)" }}>
            ✅
          </div>
          <div>
            <div className="stat-num" style={{ color: "var(--olive)" }}>
              {remaining}개
            </div>
            <div className="stat-label">남은 유효 상품</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "var(--purple-light)" }}>
            🌱
          </div>
          <div>
            <div className="stat-num" style={{ color: "var(--olive)" }}>
              {userId}
            </div>
            <div className="stat-label">분석 완료</div>
          </div>
        </div>
      </div>
    </div>
  );
}
