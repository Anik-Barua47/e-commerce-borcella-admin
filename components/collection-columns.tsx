"use client";

import { ColumnDef } from "@tanstack/react-table";
import Delete from "./delete";
import Link from "next/link";

export const CollectionColumn: ColumnDef<CollectionType>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <Link
        href={`/collections/${row.original.id}`}
        className="hover:text-gray-500"
      >
        <p>{row.original.title}</p>
      </Link>
    ),
  },
  {
    accessorKey: "products",
    header: "Products",
    cell: ({ row }) => <p>{row.original.products.length}</p>,
  },
  {
    id: "actions",
    cell: ({ row }) => <Delete id={row.original.id} />,
  },
];
