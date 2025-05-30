"use client"

import type React from "react"

import { useState } from "react"
import "./StockMovement.scss"

interface StockMovementProps {
  onSave: () => void
  onCancel: () => void
}

interface StockItem {
  id: string
  productId: string
  productName: string
  quantity: number
}

const StockMovement = ({ onSave, onCancel }: StockMovementProps) => {
  const [items, setItems] = useState<StockItem[]>([])
  const [selectedProduct, setSelectedProduct] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [movementType, setMovementType] = useState<"in" | "out" | "adjustment">("in")
  const [reason, setReason] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Mock products data
  const products = [
    { id: "1", name: "Молоко 3.2%" },
    { id: "2", name: "Хлеб белый" },
    { id: "3", name: "Яблоки Голден" },
    { id: "4", name: "Сыр Российский" },
    { id: "5", name: "Колбаса Докторская" },
  ]

  const handleAddItem = () => {
    if (!selectedProduct || quantity <= 0) return

    const product = products.find((p) => p.id === selectedProduct)
    if (!product) return

    const newItem: StockItem = {
      id: Date.now().toString(),
      productId: selectedProduct,
      productName: product.name,
      quantity,
    }

    setItems([...items, newItem])
    setSelectedProduct("")
    setQuantity(1)
  }

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) return

    setIsLoading(true)
    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      onSave()
    } catch (error) {
      console.error("Error saving stock movement:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="stock-movement-form">
      <div className="stock-movement-form__header">
        <h2 className="stock-movement-form__title">
          {movementType === "in"
            ? "Поступление товара"
            : movementType === "out"
              ? "Списание товара"
              : "Корректировка остатков"}
        </h2>
        <button className="stock-movement-form__close" onClick={onCancel}>
          ✕
        </button>
      </div>

      <form className="stock-movement-form__content" onSubmit={handleSubmit}>
        <div className="stock-movement-form__type">
          <label className="stock-movement-form__label">Тип операции</label>
          <div className="stock-movement-form__type-buttons">
            <button
              type="button"
              className={`stock-movement-form__type-button ${movementType === "in" ? "active" : ""}`}
              onClick={() => setMovementType("in")}
            >
              Поступление
            </button>
            <button
              type="button"
              className={`stock-movement-form__type-button ${movementType === "out" ? "active" : ""}`}
              onClick={() => setMovementType("out")}
            >
              Списание
            </button>
            <button
              type="button"
              className={`stock-movement-form__type-button ${movementType === "adjustment" ? "active" : ""}`}
              onClick={() => setMovementType("adjustment")}
            >
              Корректировка
            </button>
          </div>
        </div>

        <div className="stock-movement-form__reason">
          <label className="stock-movement-form__label">Причина</label>
          <input
            type="text"
            className="stock-movement-form__input"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Укажите причину операции"
            required
          />
        </div>

        <div className="stock-movement-form__add-item">
          <h3 className="stock-movement-form__subtitle">Добавить товар</h3>
          <div className="stock-movement-form__add-item-row">
            <div className="stock-movement-form__field">
              <label className="stock-movement-form__label">Товар</label>
              <select
                className="stock-movement-form__select"
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
              >
                <option value="">Выберите товар</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="stock-movement-form__field stock-movement-form__field--quantity">
              <label className="stock-movement-form__label">Количество</label>
              <input
                type="number"
                className="stock-movement-form__input"
                value={quantity}
                onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 0)}
                min="1"
              />
            </div>

            <button
              type="button"
              className="stock-movement-form__add-button"
              onClick={handleAddItem}
              disabled={!selectedProduct || quantity <= 0}
            >
              Добавить
            </button>
          </div>
        </div>

        {items.length > 0 && (
          <div className="stock-movement-form__items">
            <h3 className="stock-movement-form__subtitle">Товары</h3>
            <table className="stock-movement-form__table">
              <thead>
                <tr>
                  <th>Товар</th>
                  <th>Количество</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.productName}</td>
                    <td>{item.quantity}</td>
                    <td>
                      <button
                        type="button"
                        className="stock-movement-form__remove-button"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="stock-movement-form__actions">
          <button type="button" className="stock-movement-form__cancel" onClick={onCancel}>
            Отмена
          </button>
          <button
            type="submit"
            className="stock-movement-form__submit"
            disabled={items.length === 0 || !reason || isLoading}
          >
            {isLoading ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default StockMovement
