"use client";

import { useEffect } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageSize?: number;
  onRowClick?: (row: TData) => void;
  activeRow?: (row: TData) => boolean;
  /** Extra class on the wrapper */
  className?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageSize = 20,
  onRowClick,
  activeRow,
  className,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  });

  // sync pageSize prop changes
  useEffect(() => {
    table.setPageSize(pageSize);
  }, [pageSize, table]);

  const { pageIndex } = table.getState().pagination;
  const pageCount = table.getPageCount();

  return (
    <div className={`flex flex-col h-full ${className ?? ""}`}>
      {/* header with pagination */}
      <div className="flex items-center justify-between border-b border-border px-3 py-2 shrink-0">
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground/70 font-medium">
          Accounts
          <span className="ml-1 text-muted-foreground/40">{data.length}</span>
        </span>
        {pageCount > 1 && (
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground/50">
            {pageIndex + 1}/{pageCount}
            <Button
              variant="ghost"
              size="icon-xs"
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
            >
              <ChevronLeft className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
            >
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      {/* table body — no scroll, exact fit */}
      <div className="flex-1 overflow-hidden [&_[data-slot=table-container]]:overflow-hidden">
        <Table>
          <TableHeader className="hidden">
            <TableRow>
              {table.getHeaderGroups().map((hg) =>
                hg.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => {
                const isActive = activeRow?.(row.original) ?? false;
                return (
                  <TableRow
                    key={row.id}
                    onClick={() => onRowClick?.(row.original)}
                    className={`group cursor-pointer border-b border-border/30 transition-colors ${
                      isActive ? "bg-accent" : "hover:bg-accent/40"
                    }`}
                    style={{ borderLeft: `3px solid ${isActive ? "#5e6ad2" : "transparent"}` }}
                    data-state={isActive ? "selected" : undefined}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="group py-2 px-3 overflow-hidden max-w-0"
                        style={{ width: cell.column.getSize() !== 150 ? cell.column.getSize() : undefined }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground/40 text-[12px]">
                  No data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
