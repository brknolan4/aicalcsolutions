import { Info } from 'lucide-react'

export default function FieldTip({ label, tooltip, inline = false }) {
  return (
    <span className={`field-tip ${inline ? 'inline' : ''}`}>
      <span>{label}</span>
      <span className="info-icon" tabIndex={0} aria-label={tooltip}>
        <Info size={13} />
        <span className="tooltip-container">{tooltip}</span>
      </span>
    </span>
  )
}
