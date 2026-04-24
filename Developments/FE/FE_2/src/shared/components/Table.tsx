import { ReactNode } from 'react';
import { cn } from './Button';

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
}

export function Table<T>({ data, columns, className }: TableProps<T>) {
  return (
    <div className={cn("w-full overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-sm", className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50/80 text-slate-700 border-b border-slate-200/60 text-xs uppercase tracking-wider font-semibold">
            <tr>
              {columns.map((col, i) => (
                <th key={i} className={cn("px-5 py-4", col.className)}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-12 text-center text-slate-400 font-medium">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="text-2xl">📭</span>
                    <span>No records found</span>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
                  {columns.map((col, j) => (
                    <td key={j} className={cn("px-5 py-4 transition-colors", col.className)}>
                      {typeof col.accessor === 'function' ? col.accessor(row) : (row[col.accessor] as ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
