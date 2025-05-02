import "./LowStockAlert.scss"

interface LowStockProduct {
  id: string
  name: string
  stock: number
  threshold: number
}

interface LowStockAlertProps {
  products: LowStockProduct[]
}

const LowStockAlert = ({ products }: LowStockAlertProps) => {
  return (
    <div className="low-stock">
      <ul className="low-stock__list">
        {products.map((product) => (
          <li key={product.id} className="low-stock__item">
            <div className="low-stock__info">
              <h4 className="low-stock__name">{product.name}</h4>
              <div className="low-stock__progress">
                <div
                  className="low-stock__progress-bar"
                  style={{ width: `${(product.stock / product.threshold) * 100}%` }}
                />
              </div>
            </div>
            <div className="low-stock__count">
              <span className="low-stock__current">{product.stock}</span>
              <span className="low-stock__separator">/</span>
              <span className="low-stock__threshold">{product.threshold}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default LowStockAlert
