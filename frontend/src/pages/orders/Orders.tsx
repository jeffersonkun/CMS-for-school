import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { fetchOrders } from "@/api/orders"
import OrderTable from "./components/OrderTable"
import OrderDetails from "./components/OrderDetails"
import "./Orders.scss"

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState("")
  const [dateFilter, setDateFilter] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const { data: orders, isLoading, error } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  })

  const handleViewOrder = (orderId: string) => {
    setSelectedOrder(orderId)
  }

  const handleCloseDetails = () => {
    setSelectedOrder(null)
  }

  const filteredOrders = orders
    ? orders.filter((order) => {
        const matchesStatus = statusFilter === "" || order.status === statusFilter
        const matchesSearch =
          searchTerm === "" ||
          order.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
        
        // Simple date filter (by month/year)
        const matchesDate = dateFilter === "" || order.createdAt.includes(dateFilter)
        
        return matchesStatus && matchesSearch && matchesDate
      })
    : []

  if (isLoading) {
    return <div className="loading">Загрузка данных...</div>
  }

  if (error) {
    return <div className="error">Ошибка загрузки данных</div>
  }

  return (
    <div className="orders">
      <div className="orders__header">
        <h1 className="orders__title">Заказы</h1>
        <button className="orders__add-button">Создать заказ</button>
      </div>

      <div className="orders__filters">
        <div className="orders__search">
          <input
            type="text"
            placeholder="Поиск по номеру или клиенту..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="orders__search-input"
          />
        </div>

        <div className="orders__filter">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="orders__filter-select"
          >
            <option value="">Все статусы</option>
            <option value="pending">Ожидает</option>
            <option value="paid">Оплачен</option>
            <option value="shipped">Отправлен</option>
            <option value="delivered">Доставлен</option>
            <option value="cancelled">Отменен</option>
          </select>
        </div>

        <div className="orders__filter">
          <input
            type="month"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="orders__filter-date"
          />
        </div>
      </div>

      <div className="orders__content">
        <OrderTable orders={filteredOrders} onViewOrder={handleViewOrder} />
      </div>

      {selectedOrder && (
        <div className="orders__modal">
          <div className="orders__modal-backdrop" onClick={handleCloseDetails}></div>
          <div className="orders__modal-content">
            <OrderDetails orderId={selectedOrder} onClose={handleCloseDetails} />
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders
