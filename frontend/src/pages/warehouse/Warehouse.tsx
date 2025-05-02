"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { fetchWarehouseData } from "@/api/warehouse"
import InventoryTable from "./components/InventoryTable"
import StockMovement from "./components/StockMovement"
import LowStockAlert from "./components/LowStockAlert"
import "./Warehouse.scss"

const Warehouse = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [showStockMovement, setShowStockMovement] = useState(false)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["warehouseData"],
    queryFn: fetchWarehouseData,
  })

  const handleStockMovement = () => {
    setShowStockMovement(true)
  }

  const handleCloseStockMovement = () => {
    setShowStockMovement(false)
  }

  const handleStockMovementComplete = () => {
    refetch()
    setShowStockMovement(false)
  }

  const filteredProducts = data?.inventory
    ? data.inventory.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (categoryFilter === "" || product.category === categoryFilter),
      )
    : []

  const categories = data?.inventory
    ? Array.from(new Set(data.inventory.map((product) => product.category))).sort()
    : []

  if (isLoading) {
    return <div className="loading">Загрузка данных...</div>
  }

  if (error) {
    return <div className="error">Ошибка загрузки данных</div>
  }

  return (
    <div className="warehouse">
      <div className="warehouse__header">
        <h1 className="warehouse__title">Склад</h1>
        <button className="warehouse__add-button" onClick={handleStockMovement}>
          Оформить поставку
        </button>
      </div>

      <div className="warehouse__overview">
        <div className="warehouse__metric">
          <h3 className="warehouse__metric-title">Всего товаров</h3>
          <p className="warehouse__metric-value">{data.metrics.totalProducts}</p>
        </div>
        <div className="warehouse__metric">
          <h3 className="warehouse__metric-title">Общая стоимость</h3>
          <p className="warehouse__metric-value">{data.metrics.totalValue}</p>
        </div>
        <div className="warehouse__metric">
          <h3 className="warehouse__metric-title">Товары с низким остатком</h3>
          <p className="warehouse__metric-value">{data.metrics.lowStockCount}</p>
        </div>
        <div className="warehouse__metric">
          <h3 className="warehouse__metric-title">Поставки за месяц</h3>
          <p className="warehouse__metric-value">{data.metrics.monthlyDeliveries}</p>
        </div>
      </div>

      <div className="warehouse__alerts">
        <LowStockAlert products={data.lowStockProducts} />
      </div>

      <div className="warehouse__filters">
        <div className="warehouse__search">
          <input
            type="text"
            placeholder="Поиск товаров..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="warehouse__search-input"
          />
        </div>

        <div className="warehouse__category-filter">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="warehouse__category-select"
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

      <div className="warehouse__content">
        <InventoryTable products={filteredProducts} />
      </div>

      {showStockMovement && (
        <div className="warehouse__modal">
          <div className="warehouse__modal-backdrop" onClick={handleCloseStockMovement}></div>
          <div className="warehouse__modal-content">
            <StockMovement onSave={handleStockMovementComplete} onCancel={handleCloseStockMovement} />
          </div>
        </div>
      )}
    </div>
  )
}

export default Warehouse
