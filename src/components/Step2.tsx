import { won } from "../api";
import { ProductImage } from "../images";
import type { Analysis, CartItem } from "../types";

interface Props {
  analysis: Analysis;
  checked: Record<string, boolean>;
  onToggle: (cartId: string) => void;
  onPrev: () => void;
  onNext: () => void;
}

const TYPE_LABEL: Record<string, string> = {
  충동: "⚡ 충동 구매 상품",
  해결: "✅ 이미 해결된 니즈",
  시즌: "🌸 시즌 미스매치",
};
const TYPE_SUB: Record<string, string> = {
  충동: "검색 없이 담았고 이후 관심 신호가 없어요",
  해결: "담은 후 비슷한 상품을 이미 구매하셨어요",
  시즌: "지금 계절에 쓰기 애매한 상품이에요",
};
const TYPE_COLOR: Record<string, string> = {
  충동: "pink",
  해결: "coral",
  시즌: "purple",
};

export function Step2({ analysis: a, checked, onToggle, onPrev, onNext }: Props) {
  const groups: Record<string, CartItem[]> = {};
  a.cleansing_items.forEach((i) => {
    (groups[i.type] ??= []).push(i);
  });

  const checkedCount = Object.values(checked).filter(Boolean).length;

  return (
    <div className="two-col fade-in">
      <div>
        <div className="info-banner coral" style={{ marginBottom: 16 }}>
          체크한 상품은 삭제돼요. 원하지 않으면 체크 해제하고 넘어가도 돼요.
        </div>

        {Object.entries(groups).map(([type, items]) => (
          <div className="card" style={{ marginBottom: 14 }} key={type}>
            <div
              className="card-head"
              style={{ borderLeft: `4px solid var(--${TYPE_COLOR[type]})` }}
            >
              <div>
                <div className="card-head-title">{TYPE_LABEL[type]}</div>
                <div className="card-head-sub">{TYPE_SUB[type]}</div>
              </div>
              <span className={`badge badge-${type}`}>{items.length}개</span>
            </div>
            {items.map((item) => (
              <div key={item.cart_id}>
                <div className="product-row" onClick={() => onToggle(item.cart_id)}>
                  <div className={"check-circle" + (checked[item.cart_id] ? " checked" : "")} />
                  <div className="product-thumb">
                    <ProductImage
                      categoryId={item.category_id}
                      productId={item.product_id}
                      categoryName={item.category_name}
                    />
                  </div>
                  <div className="product-info">
                    <div className="product-name">{item.product_name}</div>
                    <div className="product-meta">
                      {item.brand} · 담은 지 {item.days_in_cart}일 · {item.referrer} 유입
                    </div>
                    <span className={`badge badge-${type}`}>
                      {type === "충동" ? "⚡ 충동" : type === "해결" ? "✅ 니즈 해결" : "🌸 시즌 미스매치"}
                    </span>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div className="product-price">{won(item.price)}</div>
                  </div>
                </div>
                <div className={`reason-box ${type}`}>💡 {item.reason}</div>
              </div>
            ))}
          </div>
        ))}

        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-head-title">장바구니 유지 상품</div>
              <div className="card-head-sub">고민·보관 상품은 그대로 둘게요</div>
            </div>
            <span style={{ fontSize: 13, color: "var(--text-soft)" }}>{a.keep_items.length}개</span>
          </div>
          {a.keep_items.map((item) => (
            <div className="keep-row" key={item.cart_id}>
              <div className="keep-thumb">
                <ProductImage
                  categoryId={item.category_id}
                  productId={item.product_id}
                  categoryName={item.category_name}
                />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{item.product_name}</div>
                <div style={{ display: "flex", gap: 7, alignItems: "center", marginTop: 4 }}>
                  <span className={`badge badge-${item.type}`}>
                    {item.type === "고민" ? "🤔 고민 중" : "📌 보관"}
                  </span>
                  <span style={{ fontSize: 11, color: "var(--text-soft)" }}>{item.reason}</span>
                </div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, flexShrink: 0 }}>{won(item.price)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="sidebar">
        <div className="sidebar-head">
          <div className="sidebar-head-title">🗑️ 클렌징 요약</div>
          <div className="sidebar-head-sub">체크한 상품이 삭제돼요</div>
        </div>
        <div>
          {Object.entries(groups).map(([type, items]) => (
            <div className="sidebar-row" key={type}>
              <span className="sidebar-row-label">{TYPE_LABEL[type]}</span>
              <span className="sidebar-row-val" style={{ color: `var(--${TYPE_COLOR[type]})` }}>
                {items.length}개
              </span>
            </div>
          ))}
          <div className="sidebar-row" style={{ borderTop: "2px solid var(--border)" }}>
            <span className="sidebar-row-label" style={{ fontWeight: 700, color: "var(--text)" }}>
              삭제 예정
            </span>
            <span className="sidebar-row-val" style={{ color: "var(--coral)", fontSize: 17 }}>
              {checkedCount}개
            </span>
          </div>
          <div className="sidebar-row">
            <span className="sidebar-row-label">남는 상품</span>
            <span className="sidebar-row-val" style={{ color: "var(--olive)" }}>
              {a.total_items - checkedCount}개
            </span>
          </div>
        </div>
        <div className="sidebar-footer">
          <button className="btn btn-outline btn-full" onClick={onPrev}>
            ← 이전으로
          </button>
          <button className="btn btn-primary btn-full btn-lg" onClick={onNext}>
            선택 삭제 후 다음 →
          </button>
        </div>
      </div>
    </div>
  );
}
