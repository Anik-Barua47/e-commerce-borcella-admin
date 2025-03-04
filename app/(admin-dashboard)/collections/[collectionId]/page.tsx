import React from "react";

import { Separator } from "@/components/ui/separator";

import { redirect } from "next/navigation";
import { getSingleCollection } from "@/actions/get-single-collection";
import CollectionsForm from "@/components/collection-columns";
const EditCollectionPage = async ({
  params,
}: {
  params: Promise<{ collectionId: string }>;
}) => {
  const { collectionId } = await params;
  const collectionDetails = await getSingleCollection(collectionId);
  const isCollectionExist = collectionDetails !== null;
  if (!isCollectionExist) {
    return redirect("/collections");
  }
  return (
    <section className="p-10">
      <div>
        <p className="text-heading2-bold text-gray-1">Edit Collection</p>
        <Separator className="mt-4 mb-7 bg-gray-1" />
      </div>
      <CollectionsForm initialData={collectionDetails} />
    </section>
  );
};

export default EditCollectionPage;
