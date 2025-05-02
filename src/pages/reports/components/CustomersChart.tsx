"use client"

import { useEffect, useRef } from "react"
import Chart from "chart.js/auto"
import "./CustomersChart.scss"

interface CustomersChartProps {
  data: {
    labels: string[]
    values: number[]
  }
  title?: string
  height?: number
}

const CustomersChart = ({ data, title = "Клиенты", height = 300 }: CustomersChartProps) => {
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

    // Generate colors for each segment
    const colors = ["rgba(37, 99, 235, 0.8)", "rgba(16, 185, 129, 0.8)", "rgba(245, 158, 11, 0.8)"]

    chartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: data.labels,
        datasets: [
          {
            data: data.values,
            backgroundColor: colors,
            borderColor: "#ffffff",
            borderWidth: 2,
            hoverOffset: 10,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              padding: 20,
              font: {
                size: 14,
              },
            },
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
              label: (context) => {
                const value = context.parsed
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
                const percentage = Math.round((value / total) * 100)
                return `${context.label}: ${value} (${percentage}%)`
              },
            },
          },
        },
        cutout: "60%",
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data])

  return (
    <div className="customers-chart">
      {title && <h3 className="customers-chart__title">{title}</h3>}
      <div className="customers-chart__container" style={{ height: `${height}px` }}>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  )
}

export default CustomersChart
