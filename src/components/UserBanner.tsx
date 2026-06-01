import type { User } from "../types";

const AVATAR: Record<string, string> = {
  지성: "🌿",
  건성: "💧",
  복합: "🌱",
  민감성: "🍃",
  중성: "✨",
};

export function UserBanner({ user }: { user: User | null }) {
  if (!user) return null;
  const avatar = AVATAR[user.skin_type] ?? "🌿";
  return (
    <div className="user-banner">
      <div className="user-banner-inner">
        <div className="user-banner-avatar">{avatar}</div>
        <div>
          <div className="user-banner-name">{user.user_id}님의 장바구니</div>
          <div className="user-banner-info">
            {user.skin_type} · {user.skin_concerns.join(", ")} · {user.age_group}
          </div>
          <div className="user-banner-tags">
            <span className="user-tag">{user.skin_type} 피부</span>
            {user.skin_concerns.map((c) => (
              <span className="user-tag" key={c}>
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
