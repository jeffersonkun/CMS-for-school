import type React from "react"
import "./ReportTable.scss"

interface ReportTableProps {
  data: Record<string, any>[]
  columns: {
    key: string
    label: string
    render?: (value: any, row: Record<string, any>) => React.ReactNode
  }[]
  title?: string
  emptyMessage?: string
}

const ReportTable = ({ data, columns, title, emptyMessage = "Нет данных для отображения" }: ReportTableProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="report-table report-table--empty">
        <p>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="report-table">
      {title && <h3 className="report-table__title">{title}</h3>}
      <div className="report-table__container">
        <table className="report-table__table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={row.id || rowIndex}>
                {columns.map((column) => (
                  <td key={`${rowIndex}-${column.key}`}>
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ReportTable
