import "./TopProducts.scss"

interface Product {
  id: string
  name: string
  sales: number
  amount: string
}

interface TopProductsProps {
  products: Product[]
}

const TopProducts = ({ products }: TopProductsProps) => {
  return (
    <div className="top-products">
      <ul className="top-products__list">
        {products.map((product) => (
          <li key={product.id} className="top-products__item">
            <div className="top-products__info">
              <h4 className="top-products__name">{product.name}</h4>
              <p className="top-products__sales">{product.sales} продаж</p>
            </div>
            <span className="top-products__amount">{product.amount}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TopProducts
