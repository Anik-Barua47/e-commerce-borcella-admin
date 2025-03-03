import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const getSingleCollection = async (collectionId: string) => {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }
  // Get single collection by id
  const collection = await prisma.collection.findUnique({
    where: {
      id: collectionId,
    },
  });
  if (!collection) {
    return null;
  }
  return collection;
};
