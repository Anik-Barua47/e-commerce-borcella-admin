"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const getCollections = async () => {
  const { userId } = await auth();

  if (!userId) {
    return []; // ✅ Always return an empty array instead of undefined
  }

  const collections = await prisma.collection.findMany({
    include: {
      products: true,
    },
  });

  return collections || []; // ✅ Ensure collections is always an array
};
