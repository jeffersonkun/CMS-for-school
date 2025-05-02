import "./RecentOrders.scss"

interface Order {
  id: string
  number: string
  customer: string
  total: string
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled"
  date: string
}

interface RecentOrdersProps {
  orders: Order[]
}

const RecentOrders = ({ orders }: RecentOrdersProps) => {
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

  const getStatusText = (status: string) => {
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
    <div className="recent-orders">
      <table className="recent-orders__table">
        <thead>
          <tr>
            <th>Номер</th>
            <th>Клиент</th>
            <th>Сумма</th>
            <th>Статус</th>
            <th>Дата</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.number}</td>
              <td>{order.customer}</td>
              <td>{order.total}</td>
              <td>
                <span className={`recent-orders__status ${getStatusClass(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </td>
              <td>{order.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default RecentOrders
