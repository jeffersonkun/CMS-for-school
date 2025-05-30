import "./LowStockAlert.scss"

interface LowStockProduct {
  id: string
  name: string
  stock: number
  minStock: number
}

interface LowStockAlertProps {
  products: LowStockProduct[]
}

const LowStockAlert = ({ products }: LowStockAlertProps) => {
  if (products.length === 0) {
    return null
  }

  return (
    <div className="low-stock-alert">
      <div className="low-stock-alert__header">
        <h3 className="low-stock-alert__title">Товары с низким остатком</h3>
        <button className="low-stock-alert__button">Заказать все</button>
      </div>

      <div className="low-stock-alert__content">
        <table className="low-stock-alert__table">
          <thead>
            <tr>
              <th>Товар</th>
              <th>Остаток</th>
              <th>Минимум</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.stock}</td>
                <td>{product.minStock}</td>
                <td>
                  <span
                    className={`low-stock-alert__status ${product.stock === 0 ? "low-stock-alert__status--out" : "low-stock-alert__status--low"}`}
                  >
                    {product.stock === 0 ? "Нет в наличии" : "Низкий остаток"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default LowStockAlert
