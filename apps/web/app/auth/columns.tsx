"use client";
import { Badge } from "ui/components/ui/badge";
import { Checkbox } from "ui/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import Fuse from "fuse.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "ui/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "ui/components/ui/tooltip";
import { Button } from "ui/components/ui/button";
import { LuMoreHorizontal } from "react-icons/lu";
import Link from "next/link";
import { deleteQuestions } from "./actions";

export type Question = {
  _recordId: number;
  "Company name": string;
  _companyId: number;
  Question: string;
  Answer: string;
  "Created at": Date;
  "Created by": string;
  "Updated at": Date;
  "Updated by": string;
  "Assigned to": string;
  Properties: string;
  Description: string;
};

export function fuzzy(data: string, searchValue: string) {
  data = data.toLowerCase();
  searchValue = searchValue.toLowerCase();
  let i = 0;
  let n = -1;
  let l: string;

  for (; (l = searchValue[i++]); )
    if (!~(n = data.indexOf(l, n + 1))) return false;
  return true;
}

export const manageColumns: ColumnDef<Question>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate") ||
          false
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    id: "recordId",
    accessorKey: "_recordId",
    header: "ID",
  },
  {
    id: "question",
    accessorKey: "Question",
    header: "Question",
    enableGlobalFilter: true,
  },
  {
    id: "answer",
    accessorKey: "Answer",
    header: "Answer",
    enableGlobalFilter: true,
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const assignedTo = row.getValue("assignedTo");
      const answer = row.getValue("answer");

      if (assignedTo === "unassigned" && answer !== "") {
        return <Badge variant="success">Completed</Badge>;
      }

      if (assignedTo === "unassigned") {
        return <Badge variant="destructive">Awaiting</Badge>;
      }

      return <Badge variant="secondary">In progress</Badge>;
    },
  },
  {
    id: "assignedTo",
    accessorKey: "Assigned to",
    accessorFn: (row, index) => {
      if (row["Assigned to"] === undefined || row["Assigned to"] === null) {
        return "unassigned";
      }

      return row["Assigned to"];
    },
    header: "Assigned to",
    cell: ({ row }) => {
      const assignedTo = row.getValue("assignedTo");
      const answer = row.getValue("answer");

      if (assignedTo === "unassigned" && answer === "") {
        return <Badge variant="destructive">Unassigned</Badge>;
      }

      if (assignedTo === "unassigned") {
        return null;
      }

      return <Badge variant="grey">{row.getValue("assignedTo")}</Badge>;
    },
  },
  {
    id: "createdBy",
    accessorKey: "Created by",
  },
  {
    id: "createdAt",
    accessorKey: "Created at",
    header: "Created at",
    cell: ({ row }) => {
      const createdBy = row.getValue("createdBy") as string;
      const date = row.getValue("createdAt") as string;
      const formatted = new Date(date).toLocaleString();

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <p>{formatted}</p>
            </TooltipTrigger>
            <TooltipContent>
              <p>{createdBy}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    id: "updatedBy",
    accessorKey: "Updated by",
  },
  {
    id: "updatedAt",
    accessorKey: "Updated at",
    header: "Last updated",
    cell: ({ row }) => {
      const date = row.getValue("updatedAt");

      if (!date) {
        return "N/A";
      }

      const updatedBy = row.getValue("updatedBy") as string;
      const formatted = new Date(date as string).toLocaleString();
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <p>{formatted}</p>
            </TooltipTrigger>
            <TooltipContent>
              <p>{updatedBy}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    id: "properties",
    accessorKey: "Properties",
    header: "Properties",
    filterFn: (row, columnId, searchValue) => {
      const value = row._valuesCache[columnId];

      if (value === undefined || value === null || value === "") {
        return true;
      }

      const matches = fuzzy(value as string, searchValue);

      return matches;
    },
    accessorFn: (row, index) => {
      const propertiesRaw = row["Properties"];
      if (propertiesRaw === undefined || propertiesRaw === null) {
        return undefined;
      }

      const properties = propertiesRaw.split(",");
      const newProperties: { key: string; value: string }[] = [];
      properties.forEach((property) => {
        const data = property.split(":");
        newProperties.push({
          key: data[0],
          value: data[1],
        });
      });

      return newProperties;
    },
    cell: ({ row }) => {
      if (row.getValue("properties") === undefined) {
        return null;
      }
      const properties = row.getValue("properties") as {
        key: string;
        value: string;
      }[];

      return (
        <div className="flex flex-row flex-wrap">
          {properties.map((property) => {
            return (
              <Badge key={property.key} variant="grey">
                {property.key}: {property.value}
              </Badge>
            );
          })}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <LuMoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/manage/edit/${row.getValue("recordId")}`}>
                Edit
              </Link>
            </DropdownMenuItem>
            <form action={deleteQuestions}>
              <input
                className="hidden"
                value={row.getValue("recordId")}
                name="selectedIds"
              />
              <DropdownMenuItem asChild>
                <Button
                  type="submit"
                  variant="ghost"
                  className="h-8 hover:outline-none w-full text-left focus-visible:ring-0 justify-start font-normal"
                >
                  Delete
                </Button>
              </DropdownMenuItem>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const myColumns: ColumnDef<Question>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate") ||
          false
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    id: "recordId",
    accessorKey: "_recordId",
    header: "ID",
  },
  {
    id: "question",
    accessorKey: "Question",
    header: "Question",
    enableGlobalFilter: true,
  },
  {
    id: "answer",
    accessorKey: "Answer",
    header: "Answer",
    enableGlobalFilter: true,
  },
  {
    id: "description",
    accessorKey: "Description",
    header: "Description",
    filterFn: (row, columnId, searchValue) => {
      const value = row._valuesCache[columnId];

      if (value === undefined || value === null || value === "") {
        return true;
      }

      const matches = fuzzy(value as string, searchValue);

      return matches;
    },
  },
  {
    id: "createdAt",
    accessorKey: "Created at",
    header: "Created at",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
      const formatted = new Date(date).toLocaleString();
      return formatted;
    },
  },
  {
    id: "updatedAt",
    accessorKey: "Updated at",
    header: "Updated at",
    cell: ({ row }) => {
      const date = row.getValue("updatedAt");

      if (!date) {
        return "N/A";
      }

      const formatted = new Date(date as string).toLocaleString();
      return formatted;
    },
  },
  {
    id: "properties",
    accessorKey: "Properties",
    header: "Properties",
    accessorFn: (row, index) => {
      const propertiesRaw = row["Properties"];
      if (propertiesRaw === undefined || propertiesRaw === null) {
        return undefined;
      }

      const properties = propertiesRaw.split(",");
      const newProperties: { key: string; value: string }[] = [];
      properties.forEach((property) => {
        const data = property.split(":");
        newProperties.push({
          key: data[0],
          value: data[1],
        });
      });

      return newProperties;
    },
    cell: ({ row }) => {
      if (row.getValue("properties") === undefined) {
        return null;
      }
      const properties = row.getValue("properties") as {
        key: string;
        value: string;
      }[];

      return (
        <div className="flex flex-row flex-wrap">
          {properties.map((property) => {
            return (
              <Badge key={property.key} variant="grey">
                {property.key}: {property.value}
              </Badge>
            );
          })}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <LuMoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/manage/edit/${row.getValue("recordId")}`}>
                Edit
              </Link>
            </DropdownMenuItem>
            <form action={deleteQuestions}>
              <input
                className="hidden"
                value={row.getValue("recordId")}
                name="selectedIds"
              />
              <DropdownMenuItem asChild>
                <Button
                  type="submit"
                  variant="ghost"
                  className="h-8 hover:outline-none w-full text-left focus-visible:ring-0 justify-start font-normal"
                >
                  Delete
                </Button>
              </DropdownMenuItem>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const respondColumns: ColumnDef<Question>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate") ||
          false
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    id: "recordId",
    accessorKey: "_recordId",
    header: "ID",
  },
  {
    id: "question",
    accessorKey: "Question",
    header: "Question",
    enableGlobalFilter: true,
  },
  {
    id: "description",
    accessorKey: "Description",
    header: "Description",
    enableGlobalFilter: true,
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const assignedTo = row.getValue("assignedTo");
      const answer = row.getValue("answer");

      if (assignedTo === "unassigned" && answer !== "") {
        return <Badge variant="success">Completed</Badge>;
      }

      if (assignedTo === "unassigned") {
        return <Badge variant="destructive">Awaiting</Badge>;
      }

      return <Badge variant="secondary">In progress</Badge>;
    },
  },
  {
    id: "assignedTo",
    accessorKey: "Assigned to",
    accessorFn: (row, index) => {
      if (row["Assigned to"] === undefined || row["Assigned to"] === null) {
        return "unassigned";
      }

      return row["Assigned to"];
    },
    header: "Assigned to",
    cell: ({ row }) => {
      const assignedTo = row.getValue("assignedTo");
      const answer = row.getValue("answer");

      if (assignedTo === "unassigned" && answer === "") {
        return <Badge variant="destructive">Unassigned</Badge>;
      }

      if (assignedTo === "unassigned") {
        return null;
      }

      return <Badge variant="grey">{row.getValue("assignedTo")}</Badge>;
    },
  },
  {
    id: "createdBy",
    accessorKey: "Created by",
  },
  {
    id: "createdAt",
    accessorKey: "Created at",
    header: "Created at",
    cell: ({ row }) => {
      const createdBy = row.getValue("createdBy") as string;
      const date = row.getValue("createdAt") as string;
      const formatted = new Date(date).toLocaleString();

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <p>{formatted}</p>
            </TooltipTrigger>
            <TooltipContent>
              <p>{createdBy}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    id: "updatedBy",
    accessorKey: "Updated by",
  },
  {
    id: "updatedAt",
    accessorKey: "Updated at",
    header: "Last updated",
    cell: ({ row }) => {
      const date = row.getValue("updatedAt");

      if (!date) {
        return "N/A";
      }

      const updatedBy = row.getValue("updatedBy") as string;
      const formatted = new Date(date as string).toLocaleString();
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <p>{formatted}</p>
            </TooltipTrigger>
            <TooltipContent>
              <p>{updatedBy}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    id: "properties",
    accessorKey: "Properties",
    header: "Properties",
    filterFn: (row, columnId, searchValue) => {
      const value = row._valuesCache[columnId];

      if (value === undefined || value === null || value === "") {
        return true;
      }

      const matches = fuzzy(value as string, searchValue);

      return matches;
    },
    accessorFn: (row, index) => {
      const propertiesRaw = row["Properties"];
      if (propertiesRaw === undefined || propertiesRaw === null) {
        return undefined;
      }

      const properties = propertiesRaw.split(",");
      const newProperties: { key: string; value: string }[] = [];
      properties.forEach((property) => {
        const data = property.split(":");
        newProperties.push({
          key: data[0],
          value: data[1],
        });
      });

      return newProperties;
    },
    cell: ({ row }) => {
      if (row.getValue("properties") === undefined) {
        return null;
      }
      const properties = row.getValue("properties") as {
        key: string;
        value: string;
      }[];

      return (
        <div className="flex flex-row flex-wrap">
          {properties.map((property) => {
            return (
              <Badge key={property.key} variant="grey">
                {property.key}: {property.value}
              </Badge>
            );
          })}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <LuMoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/manage/edit/${row.getValue("recordId")}`}>
                Edit
              </Link>
            </DropdownMenuItem>
            <form action={deleteQuestions}>
              <input
                className="hidden"
                value={row.getValue("recordId")}
                name="selectedIds"
              />
              <DropdownMenuItem asChild>
                <Button
                  type="submit"
                  variant="ghost"
                  className="h-8 hover:outline-none w-full text-left focus-visible:ring-0 justify-start font-normal"
                >
                  Delete
                </Button>
              </DropdownMenuItem>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
