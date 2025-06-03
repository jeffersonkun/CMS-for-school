"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchReportData } from "@/api/reports";
import SalesChart from "./components/SalesChart";
import ProductsChart from "./components/ProductsChart";
import CustomersChart from "./components/CustomersChart";
import ReportTable from "./components/ReportTable";
import "./Reports.scss";

const Reports = () => {
  const [reportType, setReportType] = useState<
    "sales" | "products" | "customers"
  >("sales");
  const [dateRange, setDateRange] = useState("week");

  const { data, isLoading } = useQuery({
    queryKey: ["report", reportType, dateRange],
    queryFn: () => fetchReportData(reportType),
  });

  const renderChart = () => {
    if (!data) return null;

    switch (reportType) {
      case "sales":
        return (
          <SalesChart
            data={data.chartData}
            title="Продажи за неделю"
          />
        );
      case "products":
        return (
          <ProductsChart
            data={data.chartData}
            title="Популярные товары"
          />
        );
      case "customers":
        return (
          <CustomersChart
            data={data.chartData}
            title="Сегментация клиентов"
          />
        );
      default:
        return null;
    }
  };

  const getTableColumns = () => {
    switch (reportType) {
      case "sales":
        return [
          { key: "date", label: "Дата" },
          { key: "orders", label: "Заказов" },
          { key: "sales", label: "Продажи" },
          { key: "average", label: "Средний чек" },
        ];
      case "products":
        return [
          { key: "name", label: "Товар" },
          { key: "sold", label: "Продано" },
          { key: "revenue", label: "Выручка" },
          { key: "stock", label: "Остаток" },
        ];
      case "customers":
        return [
          { key: "name", label: "Клиент" },
          { key: "orders", label: "Заказов" },
          { key: "spent", label: "Потрачено" },
          { key: "lastOrder", label: "Последний заказ" },
        ];
      default:
        return [];
    }
  };

  const getReportTitle = () => {
    switch (reportType) {
      case "sales":
        return "Отчет по продажам";
      case "products":
        return "Отчет по товарам";
      case "customers":
        return "Отчет по клиентам";
      default:
        return "Отчет";
    }
  };

  const tableData: Record<string, unknown>[] = data?.tableData ?? [];
  const columns = getTableColumns();

  return (
    <div className="reports">
      <div className="reports__header">
        <h1 className="reports__title">{getReportTitle()}</h1>
        <div className="reports__filters">
          <div className="reports__filter">
            <label htmlFor="report-type">Тип отчета:</label>
            <select
              id="report-type"
              value={reportType}
              onChange={(e) =>
                setReportType(
                  e.target.value as "sales" | "products" | "customers"
                )
              }
              className="reports__select"
            >
              <option value="sales">Продажи</option>
              <option value="products">Товары</option>
              <option value="customers">Клиенты</option>
            </select>
          </div>
          <div className="reports__filter">
            <label htmlFor="date-range">Период:</label>
            <select
              id="date-range"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="reports__select"
            >
              <option value="day">День</option>
              <option value="week">Неделя</option>
              <option value="month">Месяц</option>
              <option value="quarter">Квартал</option>
              <option value="year">Год</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="reports__loading">Загрузка данных...</div>
      ) : (
        <main className="reports__main">
          <div className="reports__metrics">
            {data?.metrics.map((metric) => (
              <div
                key={metric.id}
                className="reports__metric"
              >
                <div className="reports__metric-title">{metric.title}</div>
                <div className="reports__metric-value">{metric.value}</div>
                <div
                  className={`reports__metric-change ${
                    metric.change.isPositive
                      ? "reports__metric-change--positive"
                      : "reports__metric-change--negative"
                  }`}
                >
                  {metric.change.isPositive ? "+" : ""}
                  {metric.change.value}
                </div>
              </div>
            ))}
          </div>

          {renderChart()}

          <ReportTable
            columns={columns}
            data={tableData}
            title={getReportTitle()}
          />
        </main>
      )}
    </div>
  );
};

export default Reports;
