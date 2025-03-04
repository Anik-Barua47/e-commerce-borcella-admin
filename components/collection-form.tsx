"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "./ui/textarea";
import ImageUpload from "./image-upload";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { saveCollection } from "@/actions/collection"; // ✅ Import the server action
import Delete from "./delete";

const formSchema = z.object({
  title: z
    .string()
    .min(2)
    .max(20)
    .regex(/^[A-Za-z\s]+$/, {
      message: "Only letters and spaces are allowed",
    }),
  description: z.string().min(2).max(500).trim(),
  image: z.string(),
});

interface CollectionFormProps {
  initialData?: CollectionType | null; // ✅ If present, the form is in edit mode
}

const CollectionsForm = ({ initialData }: CollectionFormProps) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Form setup
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      image: "",
    },
  });

  const handleKeyPress = (
    e:
      | React.KeyboardEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  // Submit handler using Server Actions
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      // Call the server action
      const result = await saveCollection({
        id: initialData?.id, // ✅ Pass the ID if updating
        ...values,
      });

      setLoading(false);

      if (result.success) {
        toast.success(result.message);
        router.push("/collections"); // ✅ Redirect after success
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.log("[Collection_SAVE_ERROR]", error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="p-10 ">
      {initialData ? (
        <div className="flex items-center justify-between">
          <p className="text-3xl font-bold text-gray-500">Edit Collection</p>
          <Delete id={initialData.id} />
        </div>
      ) : (
        <p className="text-3xl font-bold text-gray-500">Create Collection</p>
      )}
      {/* <p className="text-3xl font-bold text-gray-500">
        {initialData ? "Edit Collection" : "Create Collection"}
      </p> */}
      <Separator className="mt-4 mb-7 bg-gray-400" />
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Title"
                      {...field}
                      onKeyDown={handleKeyPress}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description"
                      {...field}
                      onKeyDown={handleKeyPress}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Collection Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value ? [field.value] : []}
                      onChange={(url) => field.onChange(url)}
                      onRemove={() => field.onChange("")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-10">
              <Button type="submit" className="bg-blue-500 text-white">
                {initialData ? "Update" : "Create"}
              </Button>
              <Button
                type="button"
                onClick={() => router.push("/collections")}
                className="bg-blue-500 text-white"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CollectionsForm;
