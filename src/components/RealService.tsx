import { useEffect, useMemo, useState } from "react";
import { api, won } from "../api";
import { ProductImage } from "../images";
import type { Analysis, BucketType, CartItem, RecProduct } from "../types";

interface Props {
  userId: string;
  analysis: Analysis;
}

// 실서비스 축약형에서 노출하는 짧은 사유 문구 (화면설계서 예시 2 기준)
const SHORT_REASON: Partial<Record<BucketType, string>> = {
  해결: "이미 비슷한 걸 구매했어요",
  충동: "담은 뒤 관심 신호가 없어요",
  시즌: "지금 시즌과 맞지 않아요",
};

type Phase = "cart" | "cleansing" | "done";

export function RealService({ userId, analysis }: Props) {
  const [phase, setPhase] = useState<Phase>("cart");
  const [dismissed, setDismissed] = useState(false);

  // 삭제 후보 (충동/해결/시즌)
  const candidates = analysis.cleansing_items;

  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [openReason, setOpenReason] = useState<Record<string, boolean>>({});
  // '아직 고민돼요'로 고민 버킷으로 옮긴 상품 → 삭제 대상에서 제외, 장바구니 유지
  const [held, setHeld] = useState<Record<string, boolean>>({});
  // '시즌 알림 받기' 예약한 상품
  const [seasonAlert, setSeasonAlert] = useState<Record<string, boolean>>({});

  const [result, setResult] = useState<{ cleaned: number; kept: number } | null>(null);
  const [recOpen, setRecOpen] = useState<"cf" | "season" | null>(null);
  const [cfItems, setCfItems] = useState<RecProduct[] | null>(null);

  // 유저 변경 시 초기화
  useEffect(() => {
    setPhase("cart");
    setDismissed(false);
    const init: Record<string, boolean> = {};
    candidates.forEach((i) => (init[i.cart_id] = i.default_checked));
    setChecked(init);
    setOpenReason({});
    setHeld({});
    setSeasonAlert({});
    setResult(null);
    setRecOpen(null);
    setCfItems(null);
  }, [userId, analysis]);

  // 현재 삭제 선택된 개수 (고민으로 뺀 상품 제외)
  const selectedCount = useMemo(
    () => candidates.filter((i) => !held[i.cart_id] && checked[i.cart_id]).length,
    [candidates, held, checked]
  );

  const activeCandidates = candidates.filter((i) => !held[i.cart_id]);

  const toggleCheck = (id: string) =>
    setChecked((c) => ({ ...c, [id]: !c[id] }));

  const recommendDefaults = () => {
    const next: Record<string, boolean> = {};
    candidates.forEach((i) => {
      next[i.cart_id] = held[i.cart_id] ? false : i.default_checked;
    });
    setChecked(next);
  };

  const holdItem = (id: string) => {
    setHeld((h) => ({ ...h, [id]: true }));
    setChecked((c) => ({ ...c, [id]: false }));
  };

  const reserveSeason = (id: string) => {
    setSeasonAlert((s) => ({ ...s, [id]: true }));
    setChecked((c) => ({ ...c, [id]: false }));
  };

  const doClean = () => {
    const cleaned = selectedCount;
    const kept = analysis.total_items - cleaned;
    setResult({ cleaned, kept });
    setPhase("done");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openCf = () => {
    setRecOpen("cf");
    if (cfItems === null) {
      api.recommend(userId).then((opts) => {
        const cf = opts.find((o) => o.algo === "cf") ?? opts[0];
        setCfItems(cf ? cf.items.slice(0, 3) : []);
      });
    }
  };

  const backToCart = () => {
    setPhase("cart");
    setResult(null);
    setRecOpen(null);
  };

  // ── 장바구니 전체 상품 (방치 상품 = 삭제 후보 + 유지 상품) ──
  const cartItems: CartItem[] = [...candidates, ...analysis.keep_items];

  const typeClass = (t: BucketType) => `svc-pill svc-pill-${t}`;

  return (
    <div className="svc-wrap">
      <div className="svc-phone">
        <div className="svc-cart-head">
          <span className="svc-cart-title">장바구니</span>
          <span className="svc-cart-count">{analysis.total_items}</span>
        </div>

        {/* ── 예시 1. 장바구니 상단 진입 배너 ── */}
        {phase === "cart" && !dismissed && analysis.cleansing_count > 0 && (
          <div className="svc-banner">
            <div className="svc-banner-text">
              <strong>오래 담긴 상품 {analysis.cleansing_count}개</strong>가 있어요
              <div className="svc-banner-sub">지금 필요한 것만 남겨볼까요?</div>
            </div>
            <div className="svc-banner-actions">
              <button className="svc-btn svc-btn-primary" onClick={() => setPhase("cleansing")}>
                정리 추천 보기
              </button>
              <button className="svc-btn-ghost" onClick={() => setDismissed(true)}>
                닫기
              </button>
            </div>
          </div>
        )}

        {/* ── 예시 2. 삭제 추천 리스트 (인라인 확장) ── */}
        {phase === "cleansing" && (
          <div className="svc-clean">
            <div className="svc-clean-head">
              <span className="svc-clean-title">정리 추천 {activeCandidates.length}개</span>
              <button className="svc-btn-link" onClick={recommendDefaults}>
                추천대로 선택
              </button>
            </div>

            <div className="svc-clean-list">
              {activeCandidates.map((it) => {
                const isSeason = it.type === "시즌";
                const reserved = seasonAlert[it.cart_id];
                return (
                  <div className="svc-clean-row" key={it.cart_id}>
                    <label className="svc-check">
                      <input
                        type="checkbox"
                        checked={!!checked[it.cart_id]}
                        disabled={reserved}
                        onChange={() => toggleCheck(it.cart_id)}
                      />
                      <span className="svc-checkbox" />
                    </label>
                    <div className="svc-thumb">
                      <ProductImage
                        categoryId={it.category_id}
                        productId={it.product_id}
                        categoryName={it.category_name}
                      />
                    </div>
                    <div className="svc-clean-main">
                      <div className="svc-clean-name">{it.product_name}</div>
                      <div className="svc-clean-reason">
                        {SHORT_REASON[it.type] ?? it.reason}
                      </div>
                      {openReason[it.cart_id] && (
                        <div className="svc-evidence">
                          <span className={typeClass(it.type)}>{it.type}</span> {it.reason}
                        </div>
                      )}
                      <div className="svc-row-actions">
                        <button
                          className="svc-btn-link"
                          onClick={() =>
                            setOpenReason((o) => ({ ...o, [it.cart_id]: !o[it.cart_id] }))
                          }
                        >
                          {openReason[it.cart_id] ? "근거 접기" : "근거 보기"}
                        </button>
                        {isSeason ? (
                          <button
                            className={reserved ? "svc-btn-done" : "svc-btn-soft"}
                            disabled={reserved}
                            onClick={() => reserveSeason(it.cart_id)}
                          >
                            {reserved ? "✓ 알림 예약됨" : "시즌 알림 받기"}
                          </button>
                        ) : (
                          <button className="svc-btn-soft" onClick={() => holdItem(it.cart_id)}>
                            아직 고민돼요
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="svc-price">{won(it.price)}</div>
                  </div>
                );
              })}
              {activeCandidates.length === 0 && (
                <div className="svc-empty">정리할 상품을 모두 검토했어요.</div>
              )}
            </div>

            <div className="svc-clean-foot">
              <span className="svc-selected">
                선택 <strong>{selectedCount}개</strong>
              </span>
              <div className="svc-foot-btns">
                <button className="svc-btn-ghost" onClick={() => setPhase("cart")}>
                  취소
                </button>
                <button
                  className="svc-btn svc-btn-primary"
                  disabled={selectedCount === 0}
                  onClick={doClean}
                >
                  정리하기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── 예시 3. 정리 완료 후 가벼운 추천 ── */}
        {phase === "done" && result && (
          <div className="svc-done">
            <div className="svc-done-check">✓</div>
            <div className="svc-done-title">정리 완료</div>
            <div className="svc-done-sub">
              {result.cleaned}개를 지우고 {result.kept}개를 남겼어요
            </div>

            <div className="svc-more">
              <div className="svc-more-q">더 볼까요?</div>
              <button
                className={recOpen === "cf" ? "svc-more-btn active" : "svc-more-btn"}
                onClick={openCf}
              >
                👥 비슷한 고객이 산 상품 보기
              </button>
              <button
                className={recOpen === "season" ? "svc-more-btn active" : "svc-more-btn"}
                onClick={() => setRecOpen("season")}
              >
                ☀️ 시즌 되면 알림 받기
              </button>

              {recOpen === "cf" && (
                <div className="svc-rec-grid">
                  {cfItems === null ? (
                    <div className="svc-empty">불러오는 중…</div>
                  ) : cfItems.length === 0 ? (
                    <div className="svc-empty">추천할 상품이 없어요.</div>
                  ) : (
                    cfItems.map((p) => (
                      <div className="svc-rec-card" key={p.product_id}>
                        <div className="svc-rec-thumb">
                          <ProductImage
                            categoryId={p.category_id}
                            productId={p.product_id}
                            categoryName={p.name}
                          />
                        </div>
                        <div className="svc-rec-brand">{p.brand}</div>
                        <div className="svc-rec-name">{p.name}</div>
                        <div className="svc-rec-price">{p.price}</div>
                      </div>
                    ))
                  )}
                </div>
              )}
              {recOpen === "season" && (
                <div className="svc-toast">
                  ☀️ 시즌이 돌아오면 알림으로 알려드릴게요.
                </div>
              )}
            </div>

            <button className="svc-btn svc-btn-primary svc-btn-block" onClick={backToCart}>
              장바구니로 돌아가기
            </button>
          </div>
        )}

        {/* ── 장바구니 상품 리스트 (실제 서비스 톤) ── */}
        {phase !== "done" && (
          <div className="svc-items">
            {cartItems.map((it) => (
              <div className="svc-item" key={it.cart_id}>
                <div className="svc-thumb">
                  <ProductImage
                    categoryId={it.category_id}
                    productId={it.product_id}
                    categoryName={it.category_name}
                  />
                </div>
                <div className="svc-item-main">
                  <div className="svc-item-brand">{it.brand}</div>
                  <div className="svc-item-name">{it.product_name}</div>
                  <div className="svc-item-meta">{it.days_in_cart}일 전 담음</div>
                </div>
                <div className="svc-price">{won(it.price)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="svc-note">
        실제 올리브영 장바구니에 적용했을 때의 축약형 UI 예시입니다. 데모 탭과 동일한 분석·추천
        로직(같은 API)을 사용하지만, 결제 흐름을 방해하지 않도록 설명을 줄이고 핵심 동작만
        노출합니다.
      </p>
    </div>
  );
}
