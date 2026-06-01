import type { User } from "../types";

export type ViewKey = "flow" | "service" | "validate";

interface Props {
  users: User[];
  selected: string;
  onSelect: (id: string) => void;
  view: ViewKey;
  onView: (v: ViewKey) => void;
  cartCount: number;
}

export function Gnb({ users, selected, onSelect, view, onView, cartCount }: Props) {
  return (
    <nav className="gnb">
      <div className="gnb-inner">
        <div className="gnb-logo">
          olive<span>young</span>
        </div>
        <div className="gnb-nav">
          <a
            href="#"
            className={view === "flow" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              onView("flow");
            }}
          >
            장바구니 분석
          </a>
          <a
            href="#"
            className={view === "service" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              onView("service");
            }}
          >
            🛒 실서비스 예시
          </a>
          <a
            href="#"
            className={view === "validate" ? "active" : ""}
            onClick={(e) => {
              e.preventDefault();
              onView("validate");
            }}
          >
            🔍 분류 검증
          </a>
        </div>
        <div className="user-selector-wrap">
          <span className="user-selector-label">👤 데모 유저</span>
          <select
            className="user-selector"
            value={selected}
            onChange={(e) => onSelect(e.target.value)}
          >
            {users.map((u) => (
              <option key={u.user_id} value={u.user_id}>
                {u.user_id} — {u.skin_type}·{u.skin_concerns[0] ?? ""} (방치 {u.stale_cart})
              </option>
            ))}
          </select>
        </div>
        <button className="gnb-cart-btn">🛒 장바구니 {cartCount}</button>
      </div>
    </nav>
  );
}
