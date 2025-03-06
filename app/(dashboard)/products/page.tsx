"use client";

import { DataTable } from "@/components/custom ui/DataTable";
import Loader from "@/components/custom ui/Loader";
import { columns } from "@/components/products/ProductColumns";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const Products = () => {
  const [loading, setLoading] = useState(true);

  const [products, setProducts] = useState<ProductType[]>([]);

  const getProducts = async () => {
    try {
      const res = await fetch("/api/products", {
        method: "GET",
      });

      const data = await res.json();

      setProducts(data);

      setLoading(false);
    } catch (error) {
      console.log("[products_GET]", error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <div className="px-10 py-5 mt-8">
      <div className="flex items-center justify-between">
        <p className="text-heading2-bold">Products</p>
        <Link href="/products/new">
          <Button className="bg-blue-1 text-white">
            <Plus className="h-4 w-4 mr-2" /> Create Product
          </Button>
        </Link>
      </div>
      <Separator className="bg-grey-1 my-4" />
      <DataTable columns={columns} data={products} searchKey="title" />
    </div>
  );
};

export default Products;
