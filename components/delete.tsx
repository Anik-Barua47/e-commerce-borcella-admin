"use client";

import { Trash } from "lucide-react";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface DeleteProps {
  id: string;
}

const Delete = ({ id }: DeleteProps) => {
  const [loading, startTransition] = useTransition();
  const router = useRouter();
  const onDelete = async () => {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/collections/${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          toast.success("Deleted Successfully!!");
          router.push("/collections"); // ✅ Redirect to /collections
          router.refresh();
        }
      } catch (error) {
        console.log("[ERROR at collection DELETE]:", error);
        toast.error("Something went wrong! Its not Deleting!!!!");
      }
    });
  };
  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="text-white">
            <Trash className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              collection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={loading} onClick={onDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Delete;
