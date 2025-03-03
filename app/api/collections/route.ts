import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const collection = await req.json();
    console.log(collection);

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const existCollection = await prisma.collection.findUnique({
      where: { title: collection.title },
    });

    if (existCollection) {
      return NextResponse.json(
        { message: "Collection already exists" },
        { status: 400 }
      );
    }

    const newCollection = await prisma.collection.create({
      data: {
        ...collection,
      },
    });

    return NextResponse.json({
      message: "Collection Created Successfully",
      data: newCollection,
    });
  } catch (error) {
    console.log("[ERROR_AT_COLLECTION]:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
