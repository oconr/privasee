"use client";

import { ColumnDef } from "@tanstack/react-table";

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

export const manageColumns: ColumnDef<Question>[] = [
  {
    accessorKey: "Question",
    header: "Question",
  },
  {
    accessorKey: "Answer",
    header: "Answer",
  },
  {
    accessorKey: "Assigned to",
    header: "Assigned to",
  },
  {
    accessorKey: "Created at",
    header: "Created at",
  },
  {
    accessorKey: "Updated at",
    header: "Updated at",
  },
];

export const myColumns: ColumnDef<Question>[] = [
  {
    accessorKey: "Question",
    header: "Question",
  },
  {
    accessorKey: "Answer",
    header: "Answer",
  },
  {
    accessorKey: "Description",
    header: "Description",
  },
  {
    accessorKey: "Created at",
    header: "Created at",
  },
  {
    accessorKey: "Updated at",
    header: "Updated at",
  },
];
