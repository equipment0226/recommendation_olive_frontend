export type Step = 1 | 2 | 3 | "done";

interface Props {
  step: Step;
  maxStep: number;
  desc: string;
  onGo: (s: Step) => void;
}

const META: Record<string, { kicker: string; title: string }> = {
  "1": { kicker: "STEP 1 OF 3", title: "장바구니 현황 분석" },
  "2": { kicker: "STEP 2 OF 3", title: "클렌징 추천" },
  "3": { kicker: "STEP 3 OF 3", title: "맞춤 추천" },
  done: { kicker: "완료", title: "장바구니 정리 완료!" },
};

export function StepHeader({ step, maxStep, desc, onGo }: Props) {
  const cur = step === "done" ? 4 : step;
  const m = META[String(step)];

  const dot = (i: number) => {
    if (i < cur) return "step-circle done";
    if (i === cur) return "step-circle active";
    return "step-circle inactive";
  };

  return (
    <div className="step-header">
      <div>
        <div className="step-kicker">{m.kicker}</div>
        <div className="step-title">{m.title}</div>
        <div className="step-desc">{desc}</div>
      </div>
      <div className="step-progress">
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ display: "flex", alignItems: "center" }}>
            <div
              className="step-node"
              onClick={() => maxStep >= i && onGo(i as Step)}
            >
              <div className={dot(i)}>{i < cur ? "✓" : i}</div>
              <span className="step-node-label">
                {i === 1 ? "현황" : i === 2 ? "클렌징" : "추천"}
              </span>
            </div>
            {i < 3 && (
              <div className={"step-connector" + (i < cur ? " done" : "")} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
