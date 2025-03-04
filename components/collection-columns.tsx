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
        href={`/collections/new?collectionId=${row.original.id}`} // ✅ Redirects to form page
        className="hover:text-gray-500"
      >
        {row.original.title}
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
