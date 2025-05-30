import { useQuery } from "@tanstack/react-query"
import { fetchDashboardData } from "@/api/dashboard"
import MetricCard from "./components/MetricCard"
import SalesChart from "./components/SalesChart"
import TopProducts from "./components/TopProducts"
import RecentOrders from "./components/RecentOrders"
import LowStockAlert from "./components/LowStockAlert"
import "./Dashboard.scss"

const Dashboard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboardData"],
    queryFn: fetchDashboardData,
  })

  if (isLoading) {
    return <div className="loading">Загрузка данных...</div>
  }

  if (error) {
    return <div className="error">Ошибка загрузки данных</div>
  }

  return (
    <div className="dashboard">
      <h1 className="dashboard__title">Панель управления</h1>

      <div className="dashboard__metrics">
        <MetricCard title="Продажи сегодня" value={data.todaySales.value} change={data.todaySales.change} icon="💰" />
        <MetricCard title="Заказы сегодня" value={data.todayOrders.value} change={data.todayOrders.change} icon="📦" />
        <MetricCard title="Средний чек" value={data.averageOrder.value} change={data.averageOrder.change} icon="🧾" />
        <MetricCard
          title="Активные клиенты"
          value={data.activeCustomers.value}
          change={data.activeCustomers.change}
          icon="👥"
        />
      </div>

      <div className="dashboard__row">
        <div className="dashboard__chart">
          <h2 className="dashboard__section-title">Продажи за период</h2>
          <SalesChart data={data.salesChart} />
        </div>

        <div className="dashboard__top-products">
          <h2 className="dashboard__section-title">Топ товаров</h2>
          <TopProducts products={data.topProducts} />
        </div>
      </div>

      <div className="dashboard__row">
        <div className="dashboard__recent-orders">
          <h2 className="dashboard__section-title">Последние заказы</h2>
          <RecentOrders orders={data.recentOrders} />
        </div>

        <div className="dashboard__low-stock">
          <h2 className="dashboard__section-title">Товары с низким остатком</h2>
          <LowStockAlert products={data.lowStockProducts} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
