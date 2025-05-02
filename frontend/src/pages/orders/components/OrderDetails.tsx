import { useState, useEffect } from "react"
import { getOrderById, updateOrderStatus } from "@/api/orders"
import "./OrderDetails.scss"

interface OrderDetailsProps {
  orderId: string
  onClose: () => void
}

const OrderDetails = ({ orderId, onClose }: OrderDetailsProps) => {
  const [order, setOrder] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(orderId)
        setOrder(data)
      } catch (err) {
        setError("Не удалось загрузить данные заказа")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus)
      setOrder({ ...order, status: newStatus })
    } catch (err) {
      setError("Не удалось обновить статус заказа")
      console.error(err);
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 2,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Ожидает"
      case "paid":
        return "Оплачен"
      case "shipped":
        return "Отправлен"
      case "delivered":
        return "Доставлен"
      case "cancelled":
        return "Отменен"
      default:
        return status
    }
  }

  if (isLoading) {
    return (
      <div className="order-details">
        <div className="order-details__header">
          <h2 className="order-details__title">Детали заказа</h2>
          <button className="order-details__close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="order-details__loading">Загрузка данных заказа...</div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="order-details">
        <div className="order-details__header">
          <h2 className="order-details__title">Детали заказа</h2>
          <button className="order-details__close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="order-details__error">{error || "Заказ не найден"}</div>
      </div>
    )
  }

  return (
    <div className="order-details">
      <div className="order-details__header">
        <h2 className="order-details__title">
          Заказ {order.number} <span className="order-details__date">{formatDate(order.createdAt)}</span>
        </h2>
        <button className="order-details__close" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="order-details__content">
        <div className="order-details__section">
          <h3 className="order-details__section-title">Статус заказа</h3>
          <div className="order-details__status-wrapper">
            <div className={`order-details__status status-${order.status}`}>{getStatusLabel(order.status)}</div>
            <div className="order-details__status-actions">
              <select
                className="order-details__status-select"
                value={order.status}
                onChange={(e) => handleStatusChange(e.target.value)}
              >
                <option value="pending">Ожидает</option>
                <option value="paid">Оплачен</option>
                <option value="shipped">Отправлен</option>
                <option value="delivered">Доставлен</option>
                <option value="cancelled">Отменен</option>
              </select>
              <button className="order-details__status-button">Обновить</button>
            </div>
          </div>
        </div>

        <div className="order-details__columns">
          <div className="order-details__column">
            <div className="order-details__section">
              <h3 className="order-details__section-title">Информация о клиенте</h3>
              <div className="order-details__customer">
                <p className="order-details__customer-name">{order.customer.name}</p>
                <p className="order-details__customer-email">{order.customer.email}</p>
                <p className="order-details__customer-phone">{order.customer.phone}</p>
              </div>
            </div>

            <div className="order-details__section">
              <h3 className="order-details__section-title">Способ оплаты</h3>
              <p className="order-details__payment">{order.paymentMethod}</p>
            </div>
          </div>

          <div className="order-details__column">
            <div className="order-details__section">
              <h3 className="order-details__section-title">Сумма заказа</h3>
              <div className="order-details__summary">
                <div className="order-details__summary-row">
                  <span>Товары:</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="order-details__summary-row">
                    <span>Скидка:</span>
                    <span>-{formatPrice(order.discount)}</span>
                  </div>
                )}
                <div className="order-details__summary-row">
                  <span>Доставка:</span>
                  <span>{formatPrice(order.shipping)}</span>
                </div>
                <div className="order-details__summary-row order-details__summary-total">
                  <span>Итого:</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="order-details__section">
          <h3 className="order-details__section-title">Товары</h3>
          <div className="order-details__items">
            <table className="order-details__items-table">
              <thead>
                <tr>
                  <th>Товар</th>
                  <th>Цена</th>
                  <th>Кол-во</th>
                  <th>Сумма</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item: any) => (
                  <tr key={item.id}>
                    <td>{item.productName}</td>
                    <td>{formatPrice(item.price)}</td>
                    <td>{item.quantity}</td>
                    <td>{formatPrice(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="order-details__actions">
          <button className="order-details__action-button">Печать</button>
          <button className="order-details__action-button">Отправить чек</button>
        </div>
      </div>
    </div>
  )
}

export default OrderDetails
