import { CldUploadWidget } from "next-cloudinary";
import { Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import { useRef } from "react";

interface ImageUploadProps {
  onChange: (value: string[]) => void;
  onRemove: (value: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onChange, onRemove }) => {
  const imagesRef = useRef<string[]>([]); // Use useRef to store images

  // Update onChange when new images are uploaded
  const onUpload = (result: any) => {
    imagesRef.current.push(result.info.secure_url);
    onChange(imagesRef.current); // Send the updated list to the parent
  };

  // Remove an image from the ref and update the parent
  const handleRemove = (url: string) => {
    imagesRef.current = imagesRef.current.filter((image) => image !== url);
    onChange(imagesRef.current); // Update the parent component
    onRemove(url);
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-4">
        {imagesRef.current.map((url) => (
          <div key={url} className="relative w-[200px] h-[200px]">
            <div className="absolute top-0 right-0 z-10">
              <Button
                type="button"
                onClick={() => handleRemove(url)}
                size="sm"
                className="bg-red-1 text-white"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image
              src={url}
              alt="uploaded image"
              className="object-cover rounded-lg"
              fill
            />
          </div>
        ))}
      </div>

      <CldUploadWidget uploadPreset="eqvg6yjp" onSuccess={onUpload}>
        {({ open }) => {
          return (
            <Button
              type="button"
              onClick={() => open()}
              className="bg-grey-1 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Upload Image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;
