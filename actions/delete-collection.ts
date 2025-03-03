"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export const deleteCollection = async (collectionId: string) => {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // Ensure collection exists
    const existingCollection = await prisma.collection.findUnique({
      where: { id: collectionId },
    });

    if (!existingCollection) {
      throw new Error("Collection not found");
    }

    // Delete collection
    await prisma.collection.delete({
      where: { id: collectionId },
    });

    return { success: true, message: "Collection deleted successfully" };
  } catch (err: any) {
    console.error("[deleteCollection_ERROR]", err);
    return { success: false, message: err.message || "Internal Server Error" };
  }
};
