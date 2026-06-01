import { useEffect, useMemo, useState } from "react";
import { api } from "./api";
import { Gnb } from "./components/Gnb";
import { UserBanner } from "./components/UserBanner";
import { StepHeader, type Step } from "./components/StepHeader";
import { Step1 } from "./components/Step1";
import { Step2 } from "./components/Step2";
import { Step3 } from "./components/Step3";
import { Done } from "./components/Done";
import { Validate } from "./components/Validate";
import { RealService } from "./components/RealService";
import type { ViewKey } from "./components/Gnb";
import type { Analysis, RecOption, User } from "./types";

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [view, setView] = useState<ViewKey>("flow");

  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [recs, setRecs] = useState<RecOption[]>([]);
  const [recLoading, setRecLoading] = useState(false);

  const [step, setStep] = useState<Step>(1);
  const [maxStep, setMaxStep] = useState(1);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  // 유저 목록 로드
  useEffect(() => {
    api.users().then((us) => {
      setUsers(us);
      if (us.length) setUserId(us[0].user_id);
    });
  }, []);

  // 유저 변경 시 분석 로드
  useEffect(() => {
    if (!userId) return;
    setAnalysis(null);
    setRecs([]);
    setStep(1);
    setMaxStep(1);
    api.analysis(userId).then((a) => {
      setAnalysis(a);
      const init: Record<string, boolean> = {};
      a.cleansing_items.forEach((i) => (init[i.cart_id] = i.default_checked));
      setChecked(init);
    });
  }, [userId]);

  const currentUser = useMemo(
    () => users.find((u) => u.user_id === userId) ?? null,
    [users, userId]
  );

  const checkedCount = Object.values(checked).filter(Boolean).length;
  const remaining = analysis ? analysis.total_items - checkedCount : 0;

  const go = (s: Step) => {
    setStep(s);
    if (s !== "done" && s > maxStep) setMaxStep(s);
    if (s === 3 && recs.length === 0 && !recLoading) {
      setRecLoading(true);
      api
        .recommend(userId)
        .then(setRecs)
        .finally(() => setRecLoading(false));
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const restart = () => {
    setStep(1);
    setMaxStep(1);
    if (analysis) {
      const init: Record<string, boolean> = {};
      analysis.cleansing_items.forEach((i) => (init[i.cart_id] = i.default_checked));
      setChecked(init);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const desc =
    step === 1
      ? analysis
        ? `${userId}님의 방치 상품 ${analysis.total_items}개를 행동 데이터로 분석했어요`
        : "분석 중…"
      : step === 2
      ? "지울 상품을 선택해주세요"
      : step === 3
      ? "원하는 추천 유형을 선택해보세요"
      : "분석이 완료됐어요";

  const hasCart = analysis && analysis.total_items > 0;

  return (
    <>
      <Gnb
        users={users}
        selected={userId}
        onSelect={setUserId}
        view={view}
        onView={setView}
        cartCount={analysis?.total_items ?? 0}
      />
      <UserBanner user={currentUser} />

      <div className="layout">
        {view === "validate" ? (
          <Validate />
        ) : view === "service" ? (
          !analysis ? (
            <div className="loading">장바구니를 분석하고 있어요…</div>
          ) : (
            <RealService userId={userId} analysis={analysis} />
          )
        ) : !analysis ? (
          <div className="loading">장바구니를 분석하고 있어요…</div>
        ) : !hasCart ? (
          <div className="card">
            <div className="empty">
              이 유저는 30일 이상 방치된 장바구니 상품이 없어요.
              <br />
              상단에서 다른 데모 유저를 선택해보세요.
            </div>
          </div>
        ) : (
          <>
            <StepHeader step={step} maxStep={maxStep} desc={desc} onGo={go} />
            {step === 1 && <Step1 analysis={analysis} onNext={() => go(2)} />}
            {step === 2 && (
              <Step2
                analysis={analysis}
                checked={checked}
                onToggle={(id) => setChecked((c) => ({ ...c, [id]: !c[id] }))}
                onPrev={() => go(1)}
                onNext={() => go(3)}
              />
            )}
            {step === 3 && (
              <Step3
                options={recs}
                checkedCount={checkedCount}
                remaining={remaining}
                loading={recLoading}
                onDone={() => go("done")}
              />
            )}
            {step === "done" && (
              <Done
                userId={userId}
                cleaned={checkedCount}
                remaining={remaining}
                onRestart={restart}
              />
            )}
          </>
        )}
      </div>
    </>
  );
}
