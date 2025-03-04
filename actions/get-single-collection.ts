import prisma from "@/lib/prisma";

export async function getSingleCollection(id: string) {
  "use server"; // ✅ Ensures this function only runs on the server

  try {
    const collection = await prisma.collection.findUnique({
      where: { id },
      include: {
        products: true, // ✅ Ensure 'products' is included
      },
    });

    if (!collection) return null;

    return {
      id: collection.id,
      title: collection.title,
      description: collection.description,
      image: collection.image,
      products: collection.products || [],
    };
  } catch (error) {
    console.error("Error fetching collection:", error);
    return null;
  }
}
