"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import Link from "next/link";
import { useState } from "react";
import { Button } from "ui/components/ui/button";
import { Input } from "ui/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "ui/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "ui/components/ui/table";
import { fuzzy } from "./columns";
import { assignTo, deleteQuestions } from "./actions";
import { SelectField } from "./manage/new/Select";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  addButton?: boolean;
  bulkAssign?: boolean;
  bulkDelete?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  addButton = true,
  bulkAssign = false,
  bulkDelete = false,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
      globalFilter,
      columnVisibility: {
        createdBy: false,
        updatedBy: false,
      },
    },
    globalFilterFn: (row, ids, query) => {
      let questionResult = false;
      let answerResult = false;
      let descriptionResult = false;
      let propertiesResult = false;

      if (columns.findIndex((column) => column.id === "question") > -1) {
        const questionValue = row.getValue("question");
        if (questionValue !== undefined && questionValue !== null) {
          questionResult = fuzzy(questionValue as string, query);
        }
      }

      if (columns.findIndex((column) => column.id === "answer") > -1) {
        const answerValue = row.getValue("answer");
        if (answerValue !== undefined && answerValue !== null) {
          answerResult = fuzzy(answerValue as string, query);
        }
      }

      if (columns.findIndex((column) => column.id === "description") > -1) {
        const descriptionValue = row.getValue("description");
        if (descriptionValue !== undefined && descriptionValue !== null) {
          descriptionResult = fuzzy(descriptionValue as string, query);
        }
      }

      if (columns.findIndex((column) => column.id === "properties") > -1) {
        const propertiesValue = row.getValue("properties");
        if (propertiesValue !== undefined && propertiesValue !== null) {
          const properties = propertiesValue as {
            key: string;
            value: string;
          }[];

          for (const property of properties) {
            if (fuzzy(property.key, query) || fuzzy(property.value, query)) {
              propertiesResult = true;
            }
          }
        }
      }

      return (
        questionResult || answerResult || descriptionResult || propertiesResult
      );
    },
  });

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row items-center justify-end w-full mb-2 gap-2">
        <Input
          placeholder="Search questions, answers, descriptions, or properties"
          value={globalFilter}
          onChange={(e) => {
            table.setGlobalFilter(e.target.value);
          }}
        />
        {columns.map((column) => {
          if (column.id === "assignedTo") {
            return (
              <Select
                key={column.id}
                defaultValue="all"
                onValueChange={(newValue) =>
                  table.getColumn("assignedTo").setFilterValue(() => {
                    if (newValue === "all") {
                      return "";
                    }

                    return newValue;
                  })
                }
              >
                <SelectTrigger className="w-52">
                  <SelectValue placeholder="Assigned to" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    <SelectLabel>Users</SelectLabel>
                    {[
                      ...new Set(
                        data
                          .filter((row) => row["Assigned to"] !== undefined)
                          .map((row) => row["Assigned to"])
                      ),
                    ].map((row) => (
                      <SelectItem value={row} key={row}>
                        {row}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            );
          }

          return null;
        })}
        {addButton && (
          <Button asChild variant="secondary">
            <Link href="/manage/new">Add question</Link>
          </Button>
        )}
      </div>
      <div className="flex flex-row items-center justify-end w-full mb-2 gap-4">
        {bulkAssign && (
          <form
            action={assignTo}
            className="flex flex-row items-center justify-center gap-1"
          >
            <input
              type="text"
              name="selectedIds"
              className="hidden"
              value={table
                .getSelectedRowModel()
                .rows.map((row) => row.getValue("recordId"))
                .join(",")}
              readOnly
            />
            <SelectField
              disabled={
                !table.getIsAllRowsSelected() && !table.getIsSomeRowsSelected()
              }
              data={[
                ...new Set(
                  data
                    .filter((row) => {
                      const value = row["Assigned to"];

                      if (
                        value === null ||
                        value === undefined ||
                        value === ""
                      ) {
                        return false;
                      }

                      return true;
                    })
                    .map((row) => {
                      const value = row["Assigned to"];
                      return value;
                    })
                ),
              ].map((row) => {
                return {
                  id: row,
                  name: row,
                };
              })}
              label="Users"
              name="assignee"
              placeholder="Assign to"
            />
            <Button
              type="submit"
              variant="secondary"
              disabled={
                !table.getIsAllRowsSelected() && !table.getIsSomeRowsSelected()
              }
            >
              Assign
            </Button>
          </form>
        )}
        {bulkDelete && (
          <form
            action={deleteQuestions}
            className="flex flex-row items-center justify-center gap-1"
          >
            <input
              type="text"
              name="selectedIds"
              className="hidden"
              value={table
                .getSelectedRowModel()
                .rows.map((row) => row.getValue("recordId"))
                .join(",")}
              readOnly
            />
            <Button
              type="submit"
              variant="destructive"
              disabled={
                !table.getIsAllRowsSelected() && !table.getIsSomeRowsSelected()
              }
            >
              Delete
            </Button>
          </form>
        )}
      </div>
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
