// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/prisma"; // Ensure you have this Prisma instance
// import { auth } from "@clerk/nextjs/server";

// export const DELETE = async (
//   req: NextRequest,
//   { params }: { params: { collectionId: string } }
// ) => {
//   try {
//     // Check authentication
//     const { collectionId } = await params;
//     console.log(collectionId);
//     const { userId } = await auth();
//     if (!userId) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     // Ensure collection exists
//     const existingCollection = await prisma.collection.findUnique({
//       where: { id: collectionId },
//     });

//     if (!existingCollection) {
//       return new NextResponse("Collection not found", { status: 404 });
//     }

//     // Delete collection
//     await prisma.collection.delete({
//       where: { id: collectionId },
//     });

//     return new NextResponse("Collection deleted successfully", { status: 200 });
//   } catch (err) {
//     console.error("[collectionId_DELETE]", err);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// };
