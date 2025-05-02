"use client"

import { useEffect, useRef } from "react"
import Chart from "chart.js/auto"
import "./SalesChart.scss"

interface SalesChartProps {
  data: {
    labels: string[]
    values: number[]
  }
}

const SalesChart = ({ data }: SalesChartProps) => {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (chartRef.current) {
      // Destroy previous chart instance if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

      const ctx = chartRef.current.getContext("2d")

      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: "line",
          data: {
            labels: data.labels,
            datasets: [
              {
                label: "Продажи",
                data: data.values,
                borderColor: "#FE035D",
                backgroundColor: "rgba(254, 3, 93, 0.1)",
                borderWidth: 2,
                tension: 0.4,
                fill: true,
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
                mode: "index",
                intersect: false,
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
                grid: {
                  color: "rgba(0, 0, 0, 0.05)",
                },
              },
            },
          },
        })
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data])

  return (
    <div className="sales-chart">
      <canvas ref={chartRef} />
    </div>
  )
}

export default SalesChart
