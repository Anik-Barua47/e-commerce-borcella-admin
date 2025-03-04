"use client";

import CollectionsForm from "@/components/collection-form";
// import { CollectionType } from "@/lib/types";

interface CollectionPageProps {
    initialData: CollectionType | null;
}

const CollectionPage = ({ initialData }: CollectionPageProps) => {
    return <CollectionsForm initialData={initialData} />;
};

export default CollectionPage;
