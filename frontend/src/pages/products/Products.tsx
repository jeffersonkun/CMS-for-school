import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { fetchProducts } from "@/api/products"
import ProductTable from "./components/ProductTable"
import ProductForm from "./components/ProductForm"
import "./Products.scss"

const Products = () => {
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  })

  const handleAddProduct = () => {
    setSelectedProduct(null)
    setShowAddProduct(true)
  }

  const handleEditProduct = (productId: string) => {
    setSelectedProduct(productId)
    setShowAddProduct(true)
  }

  const handleCloseForm = () => {
    setShowAddProduct(false)
    setSelectedProduct(null)
  }

  const handleProductSaved = () => {
    refetch()
    handleCloseForm()
  }

  const filteredProducts = data
    ? data.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (categoryFilter === "" || product.category === categoryFilter)
      )
    : []

  const categories = data
    ? Array.from(new Set(data.map((product) => product.category))).sort()
    : []

  if (isLoading) {
    return <div className="loading">Загрузка данных...</div>
  }

  if (error) {
    return <div className="error">Ошибка загрузки данных</div>
  }

  return (
    <div className="products">
      <div className="products__header">
        <h1 className="products__title">Каталог товаров</h1>
        <button className="products__add-button" onClick={handleAddProduct}>
          Добавить товар
        </button>
      </div>

      <div className="products__filters">
        <div className="products__search">
          <input
            type="text"
            placeholder="Поиск товаров..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="products__search-input"
          />
        </div>

        <div className="products__category-filter">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="products__category-select"
          >
            <option value="">Все категории</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="products__content">
        <ProductTable products={filteredProducts} onEditProduct={handleEditProduct} />
      </div>

      {showAddProduct && (
        <div className="products__modal">
          <div className="products__modal-backdrop" onClick={handleCloseForm}></div>
          <div className="products__modal-content">
            <ProductForm productId={selectedProduct} onSave={handleProductSaved} onCancel={handleCloseForm} />
          </div>
        </div>
      )}
    </div>
  )
}

export default Products
