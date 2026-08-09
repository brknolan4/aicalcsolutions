export default function ResultHighlightRow({ items }) {
  return (
    <section className="result-highlight-row">
      {items.map((item) => (
        <div key={item.label} className="result-highlight-card glass-panel">
          <span className="result-highlight-label">{item.label}</span>
          <strong className="result-highlight-value">{item.value}</strong>
          {item.note && <p className="result-highlight-note">{item.note}</p>}
        </div>
      ))}
    </section>
  )
}
