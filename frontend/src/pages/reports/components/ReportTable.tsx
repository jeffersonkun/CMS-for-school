import type React from "react";
import "./ReportTable.scss";

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface ReportTableProps<T extends Record<string, unknown>> {
  data: T[];
  columns: Column<T>[];
  title?: string;
  emptyMessage?: string;
  getRowKey?: (row: T, index: number) => React.Key;
}

const ReportTable = <T extends Record<string, unknown>>({
  data,
  columns,
  title,
  emptyMessage = "Нет данных для отображения",
  getRowKey,
}: ReportTableProps<T>) => {
  if (!data || data.length === 0) {
    return (
      <div className="report-table report-table--empty">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="report-table">
      {title && <h3 className="report-table__title">{title}</h3>}
      <div className="report-table__container">
        <table className="report-table__table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={String(column.key)}>{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => {
              const rowKey =
                getRowKey?.(row, rowIndex) ??
                (typeof row["id"] === "string" || typeof row["id"] === "number"
                  ? row["id"]
                  : rowIndex);

              return (
                <tr key={rowKey}>
                  {columns.map((column) => {
                    const cellContent =
                      column.render?.(row[column.key], row) ??
                      (row[column.key] as React.ReactNode);

                    return (
                      <td key={`${rowKey}-${String(column.key)}`}>
                        {cellContent}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportTable;
