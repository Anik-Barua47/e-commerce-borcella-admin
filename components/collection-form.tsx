"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "./ui/textarea";
import ImageUpload from "./image-upload";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const formSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Must be 2 or more characters long" })
    .max(20, { message: "Must be 20 or fewer characters long" })
    .regex(/^[A-Za-z\s]+$/, {
      message: "Only letters and spaces are allowed",
    }),
  description: z.string().min(2).max(500).trim(),
  image: z.string(),
});

interface CollectionFormProps {
  initialData?: CollectionType | null;
}

const CollectionsForm = ({ initialData }: CollectionFormProps) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? initialData
      : {
          title: "",
          description: "",
          image: "",
        },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const url = initialData
        ? `/api/collections/${initialData.id}`
        : "/api/collections";
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(values),
      });

      if (res.ok) {
        setLoading(false);
        toast.success(`Collection ${initialData ? "updated" : "created"}`);
        router.push("/collections");
      }
    } catch (error) {
      console.log("[Collection_POST]", error);
      toast.error("Collection not created!! something went wrong");
    }
  };

  return (
    <div className="p-10 ">
      <p className="text-3xl font-bold text-gray-500">Create Collection</p>
      <Separator className="mt-4 mb-7 bg-gray-400" />
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ttile</FormLabel>
                  <FormControl>
                    <Input placeholder="Title" {...field} />
                  </FormControl>
                  {/* <FormDescription className="text-gray-500">
                    {form.formState.errors.title
                      ? form.formState.errors.title.message
                      : "This is your public display name."}
                  </FormDescription> */}
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
                    <Textarea placeholder="Description" {...field} />
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
                      // isMultiple={false}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-10">
              <Button type="submit" className="bg-blue-500 text-white">
                Submit
              </Button>
              <Button
                type="button"
                onClick={() => router.push("/collections")}
                className="bg-blue-500 text-white"
              >
                Discard
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CollectionsForm;
