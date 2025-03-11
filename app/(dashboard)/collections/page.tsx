"use client";

import { columns } from "@/components/collections/CollectionColumns";
import { DataTable } from "@/components/custom ui/DataTable";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const Collections = () => {
  const [loading, setLoading] = useState(false);

  const [collections, setCollections] = useState([]);

  const getCollections = async () => {
    try {
      const res = await fetch("/api/collections", {
        method: "GET",
      });
      const data = await res.json();
      setCollections(data);
      setLoading(false);
    } catch (error) {
      console.log("[collections_GET]", error);
    }
  };

  useEffect(() => {
    getCollections();
  }, []);

  console.log(collections);

  return (
    <div className="mt-10 px-10 py-5">
      <div className="flex items-center justify-between">
        <p className="text-heading1-bold">Collections</p>
        <Link href="/collections/new">
          <Button className="bg-blue-1 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Create Collection
          </Button>
        </Link>
      </div>
      <Separator className="bg-grey-1 my-4" />
      <DataTable columns={columns} data={collections} searchKey="title" />
    </div>
  );
};
export const dynamic = "force-dynamic";
export default Collections;
