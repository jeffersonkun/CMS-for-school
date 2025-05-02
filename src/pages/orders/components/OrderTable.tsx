import "./OrderTable.scss"

interface Order {
  id: string
  number: string
  customer: {
    name: string
  }
  total: number
  status: string
  createdAt: string
}

interface OrderTableProps {
  orders: Order[]
  onViewOrder: (orderId: string) => void
}

const OrderTable = ({ orders, onViewOrder }: OrderTableProps) => {
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
    }).format(date)
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case "pending":
        return "status-pending"
      case "paid":
        return "status-paid"
      case "shipped":
        return "status-shipped"
      case "delivered":
        return "status-delivered"
      case "cancelled":
        return "status-cancelled"
      default:
        return ""
    }
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

  return (
    <div className="order-table">
      <table>
        <thead>
          <tr>
            <th>Номер</th>
            <th>Клиент</th>
            <th>Дата</th>
            <th>Сумма</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.number}</td>
              <td>{order.customer.name}</td>
              <td>{formatDate(order.createdAt)}</td>
              <td>{formatPrice(order.total)}</td>
              <td>
                <span className={`order-table__status ${getStatusClass(order.status)}`}>
                  {getStatusLabel(order.status)}
                </span>
              </td>
              <td>
                <div className="order-table__actions">
                  <button className="order-table__action-btn" onClick={() => onViewOrder(order.id)}>
                    👁️
                  </button>
                  <button className="order-table__action-btn">✏️</button>
                  <button className="order-table__action-btn">🗑️</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default OrderTable
