import { useState } from "react";
import type { ChangeEvent } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const categories = [
  "All",
  "Development",
  "Design",
  "Business",
  "AI & ML",
  "Cloud",
  "Productivity",
  "Data Science",
  "Marketing",
];

type SearchAndFilterProps = {
  onSearchChange: (value: string) => void;
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: string) => void;
  selectedCategory: string;
};

export function SearchAndFilter({
  onSearchChange,
  onCategoryChange,
  onSortChange,
  selectedCategory,
}: SearchAndFilterProps) {
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
    onSearchChange(event.target.value);
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400" />
        <Input
          type="text"
          placeholder="Search courses or providers..."
          value={searchValue}
          onChange={handleSearchChange}
          className="w-full pl-12 pr-4 py-6 rounded-2xl bg-white dark:bg-gray-800 backdrop-blur-md border-2 border-gray-200 dark:border-gray-700 focus:border-[#2563eb] dark:focus:border-blue-500 transition-all duration-300 shadow-sm text-[#1e293b] dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500"
        />
      </div>

      {/* Filter Pills and Sort */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 w-full lg:w-auto scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 shadow-sm font-medium ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-[#2563eb] to-[#16a34a] text-white shadow-lg"
                  : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border-2 border-gray-300 dark:border-gray-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="w-full lg:w-auto lg:min-w-[200px]">
          <Select onValueChange={onSortChange} defaultValue="popularity">
            <SelectTrigger className="rounded-xl bg-white dark:bg-gray-800 backdrop-blur-md border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <SelectItem value="popularity" className="dark:text-white dark:focus:bg-gray-700">Sort by Popularity</SelectItem>
              <SelectItem value="category" className="dark:text-white dark:focus:bg-gray-700">Sort by Category</SelectItem>
              <SelectItem value="recent" className="dark:text-white dark:focus:bg-gray-700">Recently Added</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
