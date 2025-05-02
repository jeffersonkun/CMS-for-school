import "./MetricCard.scss"

interface MetricCardProps {
  title: string
  value: string
  change: {
    value: string
    isPositive: boolean
  }
  icon: string
}

const MetricCard = ({ title, value, change, icon }: MetricCardProps) => {
  return (
    <div className="metric-card">
      <div className="metric-card__icon">{icon}</div>
      <div className="metric-card__content">
        <h3 className="metric-card__title">{title}</h3>
        <p className="metric-card__value">{value}</p>
        <p className={`metric-card__change ${change.isPositive ? "positive" : "negative"}`}>
          {change.isPositive ? "↑" : "↓"} {change.value}
        </p>
      </div>
    </div>
  )
}

export default MetricCard
