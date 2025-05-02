import "./ProductTable.scss"

interface Product {
  id: string
  name: string
  sku: string
  price: number
  stock: number
  category: string
}

interface ProductTableProps {
  products: Product[]
  onEditProduct: (productId: string) => void
}

const ProductTable = ({ products, onEditProduct }: ProductTableProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 2,
    }).format(price)
  }

  const getStockClass = (stock: number) => {
    if (stock <= 0) return "stock-out"
    if (stock < 10) return "stock-low"
    return "stock-ok"
  }

  return (
    <div className="product-table">
      <table>
        <thead>
          <tr>
            <th>Название</th>
            <th>SKU</th>
            <th>Категория</th>
            <th>Цена</th>
            <th>Остаток</th>
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
                <span className={`product-table__stock ${getStockClass(product.stock)}`}>{product.stock}</span>
              </td>
              <td>
                <div className="product-table__actions">
                  <button className="product-table__action-btn" onClick={() => onEditProduct(product.id)}>
                    ✏️
                  </button>
                  <button className="product-table__action-btn">📋</button>
                  <button className="product-table__action-btn">🗑️</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ProductTable
