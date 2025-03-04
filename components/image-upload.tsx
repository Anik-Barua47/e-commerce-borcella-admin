"use client";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "./ui/button";
import { Plus, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";

interface ImageUploadProps {
  value: string[];
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onChange,
  onRemove,
  value,
}) => {
  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-4">
        {value.map((url) => (
          <div className="relative w-[200px] h-[200px]" key={url}>
            <div className="absolute top-0 right-0 z-10">
              <Button
                onClick={(e) => {
                  onRemove(url);
                }}
                size="sm"
                className="bg-red-500 text-white"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image
              src={url}
              alt="collection"
              className="object-cover rounded-lg"
              fill
            />
          </div>
        ))}
      </div>

      <CldUploadWidget uploadPreset="e-commerce-admin" onSuccess={onUpload}>
        {({ open }) => (
          <Button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              open();
            }}
            className="text-white flex items-center gap-x-2"
          // type="button"
          >
            <Plus className="size-4" />
            Upload Image
          </Button>
        )}
      </CldUploadWidget>
    </>
  );
};

export default ImageUpload;