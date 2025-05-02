import "./InventoryTable.scss"

interface Product {
  id: string
  name: string
  sku: string
  category: string
  price: number
  stock: number
  minStock: number
  location: string
  lastDelivery: string
}

interface InventoryTableProps {
  products: Product[]
}

const InventoryTable = ({ products }: InventoryTableProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 2,
    }).format(price)
  }

  const getStockClass = (stock: number, minStock: number) => {
    if (stock <= 0) return "stock-out"
    if (stock < minStock) return "stock-low"
    return "stock-ok"
  }

  return (
    <div className="inventory-table">
      <table>
        <thead>
          <tr>
            <th>Название</th>
            <th>SKU</th>
            <th>Категория</th>
            <th>Цена</th>
            <th>Остаток</th>
            <th>Локация</th>
            <th>Последняя поставка</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.sku}</td>
              <td>{product.category}</td>
              <td>{formatPrice(product.price)}</td>
              <td>
                <span className={`inventory-table__stock ${getStockClass(product.stock, product.minStock)}`}>
                  {product.stock}
                </span>
              </td>
              <td>{product.location}</td>
              <td>{product.lastDelivery}</td>
              <td>
                <div className="inventory-table__actions">
                  <button className="inventory-table__action-btn" title="Редактировать">
                    ✏️
                  </button>
                  <button className="inventory-table__action-btn" title="История движения">
                    📋
                  </button>
                  <button className="inventory-table__action-btn" title="Списать">
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default InventoryTable
