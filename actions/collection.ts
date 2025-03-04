"use server";

import db from "@/lib/prisma"; // Import Prisma client
import { revalidatePath } from "next/cache";

export async function saveCollection(formData: {
    id?: string;
    title: string;
    description: string;
    image: string;
}) {
    try {
        if (formData.id) {
            // ✅ Update existing collection
            const updatedCollection = await db.collection.update({
                where: { id: formData.id },
                data: {
                    title: formData.title,
                    description: formData.description,
                    image: formData.image,
                },
            });
            revalidatePath("/collections"); // ✅ Revalidate cache for updated collections
            return { success: true, message: "Collection updated successfully!" };
        } else {
            // ✅ Create new collection
            const newCollection = await db.collection.create({
                data: {
                    title: formData.title,
                    description: formData.description,
                    image: formData.image,
                },
            });
            revalidatePath("/collections"); // ✅ Refresh collections page
            return { success: true, message: "Collection created successfully!" };
        }
    } catch (error) {
        console.error("Collection Save Error:", error);
        return { success: false, message: "Failed to save collection." };
    }
}
