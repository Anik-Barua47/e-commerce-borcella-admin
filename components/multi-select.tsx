import { useState } from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface MultiSelectProps {
  collections: CollectionType[]; // List of collections to choose from
  placeholder: string;
  value: string[]; // The list of selected collection IDs
  onChange: (value: string) => void; // Handler to update the selected values
  onRemove: (value: string) => void; // Handler to remove a selected collection
}

const MultiSelect = ({
  collections,
  value,
  onChange,
  onRemove,
  placeholder,
}: MultiSelectProps) => {
  const [query, setQuery] = useState(""); // State for search query
  const [dropdownOpen, setDropdownOpen] = useState(false); // State to control dropdown visibility

  // Filter collections based on search query and also exclude already selected collections
  const filteredCollections = collections.filter(
    (collection) =>
      collection.title.toLowerCase().includes(query.toLowerCase()) && // Filter by search
      !value.includes(collection.id) // Exclude already selected collections
  );

  const handleSelect = (id: string) => {
    const selectedCollection = collections.find((col) => col.id === id); // Get the collection based on the id
    if (selectedCollection) {
      console.log("Selected Collection ID:", selectedCollection.id); // Log the collection ID
      console.log("Selected Collection Title:", selectedCollection.title); // Log the collection title
    }
    onChange(id);
    setDropdownOpen(false); // Close the dropdown after selection
  };

  return (
    <div className="relative">
      {/* Display the selected collections or placeholder */}
      <div
        onClick={() => setDropdownOpen(!dropdownOpen)} // Toggle dropdown visibility
        className="cursor-pointer border p-2 rounded-md w-full flex items-center justify-between text-gray-500"
      >
        <div className="flex flex-wrap gap-2 tex-sm">
          {value.length > 0
            ? value.map((id) => {
                const collection = collections.find((col) => col.id === id);
                return (
                  <span
                    key={id}
                    className="rounded-sm px-1 flex items-center text-sm border"
                  >
                    {collection?.title}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent closing dropdown when removing
                        onRemove(id);
                      }}
                      className="ml-2 text-sm text-black"
                    >
                      x
                    </button>
                  </span>
                );
              })
            : placeholder}
        </div>
        <div className="text-gray-500">{value.length > 0 ? "" : "+"}</div>
      </div>

      {/* Dropdown list using ShadCN Command components */}
      {dropdownOpen && (
        <div className="absolute z-10 mt-2 w-full max-w-md bg-white border rounded-lg shadow-md">
          <Command>
            <CommandInput
              value={query}
              onValueChange={(value) => setQuery(value)} // Update search query
              className="w-full p-2 border-b text-sm"
              placeholder="Search collections..."
            />
            <CommandList>
              {filteredCollections.length > 0 ? (
                filteredCollections.map((collection) => (
                  <CommandItem
                    key={collection.id}
                    onSelect={() => handleSelect(collection.id)} // Select collection and close dropdown
                    className="cursor-pointer p-2 hover:bg-gray-100"
                  >
                    {collection.title}
                  </CommandItem>
                ))
              ) : (
                <CommandEmpty>No collections found</CommandEmpty>
              )}
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
