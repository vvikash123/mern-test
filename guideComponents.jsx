import { useState, useEffect } from "react";

export function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="code-block-wrap">
      <pre className="code-block-pre">{code}</pre>
      <button type="button" className="code-block-copy" onClick={copy} style={{
        background: copied ? "#a6e3a1" : "#313244",
        color: copied ? "#1e1e2e" : "#cdd6f4",
        border: "none", borderRadius: 5, padding: "3px 10px",
        fontSize: 11, cursor: "pointer",
      }}>
        {copied ? "✓ Copied" : "Copy"}
      </button>
    </div>
  );
}

export function Badge({ text, bg, color }) {
  return (
    <span style={{
      background: bg, color, fontSize: 11,
      padding: "2px 10px", borderRadius: 20, fontWeight: 500,
    }}>{text}</span>
  );
}

export function InterviewTip({ text }) {
  return (
    <div
      className="interview-tip"
      style={{
        marginTop: 12, padding: "10px 14px",
        background: "#fff8e7", borderLeft: "3px solid #f59e0b",
        borderRadius: "0 6px 6px 0", color: "#78350f",
      }}
    >
      <strong>⚡ Interview tip:</strong> {text}
    </div>
  );
}

function SectionsPanel({ sections }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    setActive(0);
  }, [sections]);
  const s = sections[active];
  return (
    <div>
      <div className="section-tabs">
        {sections.map((sec, i) => (
          <button key={sec.name} type="button" className="section-tab-btn" onClick={() => setActive(i)} style={{
            padding: "6px 14px", borderRadius: 20, border: "1.5px solid",
            borderColor: active === i ? sec.color : "#e2e8f0",
            background: active === i ? sec.bg : "white",
            color: active === i ? sec.color : "#64748b",
            fontWeight: active === i ? 600 : 400,
            fontSize: 13, cursor: "pointer",
          }}>{sec.name}</button>
        ))}
      </div>
      <div style={{ background: s.bg, borderRadius: 12, padding: "18px 20px", marginBottom: 12 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: s.color, marginBottom: 4 }}>{s.name}</div>
        <div style={{ color: "#334155", fontSize: 14 }}>{s.desc}</div>
      </div>
      <div style={{ marginBottom: 4, color: "#64748b", fontSize: 13 }}>
        <strong style={{ color: "#1e293b" }}>When to use: </strong>{s.when}
      </div>
      <CodeBlock code={s.code} />
      <InterviewTip text={s.interview} />
    </div>
  );
}

/** Reusable layout: hero, topic sidebar, sections + code (same pattern as React guide body). */
export function GuideLayout({ hero, topics, contents, accent }) {
  const [selected, setSelected] = useState(topics[0].id);
  const topicData = contents[selected];
  const { primary, soft, text } = accent;

  return (
    <div className="guide-page">
      <div className="guide-hero">
        <div className="guide-hero-title">
          {hero.emoji} {hero.title}
        </div>
        <div className="guide-hero-sub">{hero.subtitle}</div>
        <div className="guide-hero-pills">
          {hero.pills.map((b) => (
            <span key={b} style={{ background: "rgba(255,255,255,0.1)", padding: "3px 12px", borderRadius: 20, fontSize: 12, color: "#e2e8f0" }}>{b}</span>
          ))}
        </div>
      </div>

      <div className="guide-grid">
        <div className="guide-sidebar">
          {topics.map((t) => (
            <button key={t.id} type="button" className="guide-topic-btn" onClick={() => setSelected(t.id)} style={{
              display: "flex", gap: 10,
              padding: "9px 14px", borderRadius: 9,
              border: "1.5px solid",
              borderColor: selected === t.id ? primary : "transparent",
              background: selected === t.id ? soft : "transparent",
              color: selected === t.id ? text : "#475569",
              fontWeight: selected === t.id ? 600 : 400,
              fontSize: 13.5, cursor: "pointer", textAlign: "left",
            }}>
              <span style={{ fontSize: 16 }}>{t.icon}</span>
              <span>{t.id}. {t.title}</span>
            </button>
          ))}
        </div>

        <div className="guide-main">
          <div style={{ marginBottom: 18, paddingBottom: 16, borderBottom: "1px solid #f1f5f9" }}>
            <div className="guide-main-header-title">{topicData.title}</div>
            <div className="guide-main-header-sub">{topicData.subtitle}</div>
            {topicData.story && (
              <div className="guide-story">
                <span style={{ fontWeight: 700, color: "#92400e" }}>Simple story — </span>
                {topicData.story}
              </div>
            )}
          </div>
          <SectionsPanel sections={topicData.sections} />
        </div>
      </div>
    </div>
  );
}
