"use client"

import { useEffect, useRef } from "react"
import Chart from "chart.js/auto"
import "./SalesChart.scss"

interface SalesChartProps {
  data: {
    labels: string[]
    values: number[]
  }
  title?: string
}

const SalesChart = ({ data, title = "Продажи" }: SalesChartProps) => {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.labels,
        datasets: [
          {
            label: "Продажи",
            data: data.values,
            backgroundColor: "rgba(37, 99, 235, 0.1)",
            borderColor: "rgba(37, 99, 235, 1)",
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointBackgroundColor: "rgba(37, 99, 235, 1)",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            padding: 12,
            titleFont: {
              size: 14,
              weight: "bold",
            },
            bodyFont: {
              size: 13,
            },
            callbacks: {
              label: (context) => `₽${context.parsed.y.toLocaleString("ru-RU")}`,
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => `₽${value.toLocaleString("ru-RU")}`,
            },
          },
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data])

  return (
    <div className="sales-chart" style={{height: 'fit-content'}}>
      {title && <h3 className="sales-chart__title">{title}</h3>}
      <div className="sales-chart__container">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  )
}

export default SalesChart
