export default function AdSlot({ id, label = 'Ad Space' }) {
  return (
    <div className="ad-slot" id={`ad-slot-${id}`}>
      {label}
    </div>
  )
}
