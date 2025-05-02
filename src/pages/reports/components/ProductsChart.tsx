"use client"

import { useEffect, useRef } from "react"
import Chart from "chart.js/auto"
import "./ProductsChart.scss"

interface ProductsChartProps {
  data: {
    labels: string[]
    values: number[]
  }
  title?: string
  height?: number
}

const ProductsChart = ({ data, title = "Популярные товары", height = 300 }: ProductsChartProps) => {
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

    // Generate colors for each bar
    const colors = [
      "rgba(37, 99, 235, 0.8)",
      "rgba(59, 130, 246, 0.8)",
      "rgba(96, 165, 250, 0.8)",
      "rgba(147, 197, 253, 0.8)",
      "rgba(191, 219, 254, 0.8)",
    ]

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.labels,
        datasets: [
          {
            label: "Количество продаж",
            data: data.values,
            backgroundColor: colors,
            borderColor: colors.map((color) => color.replace("0.8", "1")),
            borderWidth: 1,
            borderRadius: 4,
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
              precision: 0,
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
    <div className="products-chart">
      {title && <h3 className="products-chart__title">{title}</h3>}
      <div className="products-chart__container" style={{ height: `${height}px` }}>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  )
}

export default ProductsChart
