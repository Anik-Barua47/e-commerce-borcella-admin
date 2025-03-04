"use client";

import { useEffect, useState } from "react";
import { getCollections } from "@/actions/get-collection";
import { CollectionColumn } from "@/components/collection-columns";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const CollectionsForm = () => {
  const [collections, setCollections] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCollections();
      setCollections(data || []);
    };
    fetchData();
  }, []);

  return (
    <div className="px-10 py-5">
      <div className="flex items-center justify-between">
        <p className="text-3xl font-bold text-gray-500">Collection</p>
        <Link href="/collections/new">
          <Button className="bg-blue-500 text-white">
            <Plus className="w-4 h-4 mr-1" />
            Create Collection
          </Button>
        </Link>
      </div>
      <Separator className="bg-gray-500 my-4" />
      <DataTable
        columns={CollectionColumn}
        data={collections}
        searchKey="title"
      />
    </div>
  );
};

export default CollectionsForm;
