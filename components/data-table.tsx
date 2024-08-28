import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  Row,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useSearchParams } from "next/navigation";
import { StatusType } from "@/types";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterKey: string;
  onDelete: (rows: Row<TData>[]) => void;
  disabled?: boolean;
  totalPages: number;
  totalItems: number;
  limit: number;
  page: number;
  handleNext: () => void;
  handlePrevious: () => void;
  search: string;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFilterStatus?: (status?: StatusType) => void;
  handleLimit?: (limit?: number) => void;
}

export const DataTable = React.forwardRef<
  HTMLDivElement,
  DataTableProps<any, any>
>(
  (
    {
      columns,
      data,
      filterKey,
      totalPages,
      totalItems,
      limit,
      page,
      handleNext,
      handlePrevious,
      search,
      handleSearch,
      handleFilterStatus,
      handleLimit,
    }: DataTableProps<any, any>,
    ref
  ) => {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
      React.useState<ColumnFiltersState>([]);
    const [rowSelection, setRowSelection] = React.useState({});
    // status
    const params = useSearchParams();
    const status = params.get("status");

    const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      onSortingChange: setSorting,
      getSortedRowModel: getSortedRowModel(),
      onColumnFiltersChange: setColumnFilters,
      getFilteredRowModel: getFilteredRowModel(),
      onRowSelectionChange: setRowSelection,
      state: {
        sorting,
        columnFilters,
        rowSelection,
      },
      manualPagination: true,
      pageCount: totalPages,
      rowCount: limit,
    });

    return (
      <div>
        <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-end py-4">
          <Input
            placeholder={`Filter ${filterKey}...`}
            value={search}
            onChange={handleSearch}
            className="sm:max-w-xs"
          />
          <div className="flex gap-2 sm:gap-4 w-full sm:w-fit">
            {!!handleFilterStatus && (
              <div className="w-full sm:w-[150px]">
                <Select
                  defaultValue={status ?? ""}
                  onValueChange={(value) =>
                    handleFilterStatus(
                      value === "-" ? undefined : (value as StatusType)
                    )
                  }
                >
                  <SelectTrigger className="w-full text-sm">
                    <SelectValue placeholder="Filter status" />
                  </SelectTrigger>
                  <SelectContent className="text-sm">
                    <SelectItem value="-">SEMUA</SelectItem>
                    <SelectItem value="DIPROSES">DIPROSES</SelectItem>
                    <SelectItem value="DITERIMA">DITERIMA</SelectItem>
                    <SelectItem value="DITOLAK">DITOLAK</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            {!!handleLimit && (
              <div className="w-[70px]">
                <Select
                  defaultValue={limit.toString()}
                  onValueChange={(value) => handleLimit(parseInt(value))}
                >
                  <SelectTrigger className="w-full text-sm">
                    <SelectValue placeholder="-" />
                  </SelectTrigger>
                  <SelectContent className="text-sm">
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
        <div className="rounded-md border" ref={ref}>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Tidak ada hasil.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between gap-1 sm:gap-2 space-x-2 py-4">
          <p className="text-xs sm:text-sm text-slate-500">
            Menampilkan <span className="font-semibold">{data.length}</span>{" "}
            dari <span className="font-semibold">{totalItems}</span>
          </p>
          <div className="flex items-center justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={page <= 1}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <div className="text-sm text-muted-foreground px-3">
              {page}
              <small>{!totalPages ? "" : `/${totalPages}`}</small>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={totalItems <= page * limit}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }
);

DataTable.displayName = "DataTable";
