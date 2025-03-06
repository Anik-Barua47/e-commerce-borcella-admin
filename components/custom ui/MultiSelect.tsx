import { useState } from "react";
import { Badge } from "../ui/badge";
import { X } from "lucide-react"; // For the remove icon
import { CheckCircle } from "lucide-react"; // For the selected icon

interface MultiSelectProps {
  placeholder: string;
  collections: CollectionType[];
  value: string[];
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  placeholder,
  collections,
  value,
  onChange,
  onRemove,
}) => {
  const [inputValue, setInputValue] = useState("");

  // Get selected collections
  let selected: CollectionType[] = [];
  if (value.length > 0) {
    selected = value.map((id) =>
      collections.find((collection) => collection._id === id)
    ) as CollectionType[];
  }

  // Get non-selected collections
  const selectables = collections.filter(
    (collection) => !selected.includes(collection)
  );

  const handleCollectionSelect = (id: string) => {
    // If collection is not selected, add it
    if (!value.includes(id)) {
      onChange(id);
    } else {
      onRemove(id); // Otherwise, remove it
    }
  };

  return (
    <div>
      {/* Display selected collections as badges */}
      <div className="flex gap-2 flex-wrap">
        {selected.map((collection) => (
          <Badge
            key={collection._id}
            className="bg-blue-1 hover:bg-black text-white flex items-center"
          >
            {collection.title}
            <button
              type="button"
              className="ml-2"
              onClick={() => onRemove(collection._id)}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>

      {/* Instructional message */}
      <span className="text-gray-500 text-sm mt-2 block">
        Click on a collection to choose it.
      </span>

      {/* Display collection buttons */}
      <div className="mt-4 flex gap-2 flex-wrap">
        {selectables.map((collection) => (
          <button
            key={collection._id}
            onClick={() => handleCollectionSelect(collection._id)}
            className={`px-4 py-2 rounded-md border text-white hover:bg-black  ${
              value.includes(collection._id)
                ? "bg-blue-1 hover:text-white"
                : "bg-grey-1 text-white"
            }`}
          >
            {collection.title}
            {value.includes(collection._id) && (
              <CheckCircle className="ml-2 h-4 w-4 text-green-500" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MultiSelect;
