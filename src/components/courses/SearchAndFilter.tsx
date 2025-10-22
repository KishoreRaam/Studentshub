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
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#475569] dark:text-slate-300" />
        <Input
          type="text"
          placeholder="Search courses or providers..."
          value={searchValue}
          onChange={handleSearchChange}
          className="w-full pl-12 pr-4 py-6 rounded-2xl bg-white/80 dark:bg-[color:var(--color-card)] dark:bg-opacity-90 backdrop-blur-md border-2 border-gray-200 dark:border-[color:var(--color-border)] focus:border-[#2563eb] dark:focus:border-[#3b82f6] transition-all duration-300 shadow-sm text-[#1e293b] dark:text-[color:var(--color-card-foreground)] dark:placeholder:text-slate-500"
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
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 shadow-sm ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-[#2563eb] to-[#16a34a] dark:from-[#2563eb] dark:to-[#16a34a] text-white shadow-lg"
                  : "bg-gray-100/90 dark:bg-[color:var(--color-card)] dark:bg-opacity-80 text-[#475569] dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-800/80 border border-transparent dark:border-[color:var(--color-border)] dark:border-opacity-60"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="w-full lg:w-auto lg:min-w-[200px]">
          <Select onValueChange={onSortChange} defaultValue="popularity">
            <SelectTrigger className="rounded-xl bg-white/80 dark:bg-[color:var(--color-card)] dark:bg-opacity-85 backdrop-blur-md border-2 border-gray-200 dark:border-[color:var(--color-border)] dark:text-[color:var(--color-card-foreground)]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">Sort by Popularity</SelectItem>
              <SelectItem value="category">Sort by Category</SelectItem>
              <SelectItem value="recent">Recently Added</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
