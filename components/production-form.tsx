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
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { saveCollection } from "@/actions/collection"; // ✅ Import the server action
import Delete from "./delete";
import MultiText from "./multi-text";
import MultiSelect from "./multi-select";
import { getCollections } from "@/actions/get-collection";

const formSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Title must be at least 2 characters long." })
    .max(20, { message: "Title must not exceed 20 characters." })
    .regex(/^[A-Za-z\s]+$/, {
      message: "Only letters and spaces are allowed in the title.",
    }),
  description: z
    .string()
    .min(2, { message: "Description must be at least 2 characters long." })
    .max(500, { message: "Description must not exceed 500 characters." })
    .trim(),
  media: z
    .array(z.string())
    .nonempty({ message: "At least one media item is required." }),
  category: z.string().min(1, { message: "Category is required." }),
  collections: z
    .array(z.string())
    .nonempty({ message: "At least one collection must be selected." }),
  tags: z
    .array(z.string())
    .nonempty({ message: "At least one tag is required." }),
  sizes: z
    .array(z.string())
    .nonempty({ message: "At least one size must be selected." }),
  colors: z
    .array(z.string())
    .nonempty({ message: "At least one color must be selected." }),
  price: z.coerce.number().min(0.1, { message: "Price must be at least 0.1." }),
  expense: z.coerce
    .number()
    .min(0.1, { message: "Expense must be at least 0.1." }),
});

interface ProductFormProps {
  initialData?: ProductType | null; // ✅ If present, the form is in edit mode
}

const ProductForm = ({ initialData }: ProductFormProps) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [collections, setCollections] = useState<any[]>([]); // ✅ Always default to an empty array

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCollections();
      console.log("Fetched collections:", data); // Ensure collections are properly fetched
      setCollections(data);
    };
    fetchData();
  }, []);

  // Form setup
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      media: [],
      category: "",
      collections: [], // Ensure collections are initialized from `initialData`
      tags: [],
      sizes: [],
      colors: [],
      price: 0.1,
      expense: 0.1,
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

      const url = initialData
        ? `/api/products/${initialData.id}`
        : `/api/products`;

      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(values),
      });

      if (res.ok) {
        setLoading(false);
        toast.success(`Product ${initialData ? "updated" : "created"}`);
        router.push("/products");
      }
    } catch (error) {
      console.log("[Products_SAVE_ERROR]", error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="p-10 ">
      {initialData ? (
        <div className="flex items-center justify-between">
          <p className="text-3xl font-bold text-gray-500">Edit Product</p>
          <Delete id={initialData.id} />
        </div>
      ) : (
        <p className="text-3xl font-bold text-gray-500">Create Product</p>
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
              name="media"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={(url) => field.onChange([...field.value, url])}
                      onRemove={(url) =>
                        field.onChange([
                          ...field.value.filter((image) => image !== url),
                        ])
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="md:grid md:grid-cols-3 gap-5">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Price"
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
                name="expense"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expense ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Expense"
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
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Category"
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
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <MultiText
                        placeholder="Tags"
                        value={field.value}
                        onChange={(tag) =>
                          field.onChange([...field.value, tag])
                        }
                        onRemove={(tagToRemove) =>
                          field.onChange([
                            ...field.value.filter((tag) => tag !== tagToRemove),
                          ])
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="colors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Colors</FormLabel>
                    <FormControl>
                      <MultiText
                        placeholder="Colors"
                        value={field.value}
                        onChange={(color) =>
                          field.onChange([...field.value, color])
                        }
                        onRemove={(colorToRemove) =>
                          field.onChange([
                            ...field.value.filter(
                              (color) => color !== colorToRemove
                            ),
                          ])
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sizes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sizes</FormLabel>
                    <FormControl>
                      <MultiText
                        placeholder="Sizes"
                        value={field.value}
                        onChange={(size) =>
                          field.onChange([...field.value, size])
                        }
                        onRemove={(sizeToRemove) =>
                          field.onChange([
                            ...field.value.filter(
                              (size) => size !== sizeToRemove
                            ),
                          ])
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="collections"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Collections</FormLabel>
                    <FormControl>
                      <MultiSelect
                        collections={collections}
                        placeholder="Select Collections..."
                        value={field.value || []} // Pass the current selected collections
                        onChange={(id) => {
                          const updatedValue = [...(field.value || []), id]; // Add new collection to the list
                          field.onChange(updatedValue); // Update the form field with selected collections
                        }}
                        onRemove={(id) => {
                          const updated = (field.value || []).filter(
                            (item) => item !== id
                          ); // Remove collection from the list
                          field.onChange(updated); // Update the form field with the remaining collections
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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

export default ProductForm;
