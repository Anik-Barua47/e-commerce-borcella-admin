import { getSingleCollection } from "@/actions/get-single-collection";
import CollectionPage from "@/components/CollectionPage";

const CreateOrEditCollection = async ({
  searchParams,
}: {
  searchParams?: { collectionId?: string };
}) => {
  // ✅ Fetch collection on the server before rendering
  let collectionData = null;

  if (searchParams?.collectionId) {
    collectionData = await getSingleCollection(searchParams.collectionId);
  }

  return <CollectionPage initialData={collectionData} />;
};

export default CreateOrEditCollection;
