import { useState } from "react";
import { MapPin, SlidersHorizontal, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import type { SearchFilters } from "@/lib/types";
import type { Location } from "@shared/schema";

interface SearchFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onSaveSearch?: () => void;
  onClearFilters?: () => void;
}

export default function SearchFilters({
  filters,
  onFiltersChange,
  onSaveSearch,
  onClearFilters,
}: SearchFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: locations = [] } = useQuery<Location[]>({
    queryKey: ["/api/locations"],
  });

  const updateFilter = (key: keyof SearchFilters, value: string | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value === "all" ? undefined : value,
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== "rent" && value !== "all"
  );

  return (
    <section className="bg-muted py-4 md:py-6" data-testid="search-filters">
      <div className="container mx-auto px-4">
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg smooth-transition">
          {/* Mobile: Compact view with expand button */}
          <div className="block md:hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <SlidersHorizontal className="w-5 h-5 mr-2 text-primary" />
                Search Filters
                {hasActiveFilters && (
                  <span className="ml-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                    Active
                  </span>
                )}
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                data-testid="button-expand-filters"
              >
                {isExpanded ? "Collapse" : "Expand"}
              </Button>
            </div>

            {/* Quick filters row for mobile */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div data-testid="filter-location-mobile">
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-2 top-1/2 transform -translate-y-1/2 text-accent w-3 h-3" />
                  <Select
                    value={filters.locationId || "all"}
                    onValueChange={(value) => updateFilter("locationId", value)}
                  >
                    <SelectTrigger className="pl-7 h-9 text-sm">
                      <SelectValue placeholder="All Nepal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">सम्पूर्ण नेपाल | All Nepal</SelectItem>
                      {locations.map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div data-testid="filter-price-type-mobile">
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Type
                </label>
                <Select
                  value={filters.priceType || "rent"}
                  onValueChange={(value) => updateFilter("priceType", value)}
                >
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="For Rent" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rent">For Rent</SelectItem>
                    <SelectItem value="sale">For Sale</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Desktop: Full view or Mobile: Expanded view */}
          <div className={`${isExpanded ? 'block' : 'hidden md:block'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
              {/* Category Filter */}
              <div data-testid="filter-category">
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Category
                </label>
                <Select
                  value={filters.categoryId || "all"}
                  onValueChange={(value) => updateFilter("categoryId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {/* Categories will be populated from API */}
                  </SelectContent>
                </Select>
              </div>

              {/* Subcategory Filter */}
              <div data-testid="filter-subcategory">
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Subcategory
                </label>
                <Select
                  value={filters.subcategoryId || "all"}
                  onValueChange={(value) => updateFilter("subcategoryId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Subcategories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subcategories</SelectItem>
                    {/* Subcategories will be populated based on selected category */}
                  </SelectContent>
                </Select>
              </div>

              {/* Location Filter */}
              <div className="relative hidden md:block" data-testid="filter-location">
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent w-4 h-4" />
                  <Select
                    value={filters.locationId || "all"}
                    onValueChange={(value) => updateFilter("locationId", value)}
                  >
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="All Nepal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">सम्पूर्ण नेपाल | All Nepal</SelectItem>
                      {locations.map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

            {/* For Rent/Sale Filter */}
            <div data-testid="filter-price-type">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                For Rent/Sale
              </label>
              <Select
                value={filters.priceType || "rent"}
                onValueChange={(value) => onFiltersChange({ ...filters, priceType: value as "rent" | "sale" })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue>
                    {filters.priceType === "rent" ? "For Rent" : "For Sale"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rent">For Rent</SelectItem>
                  <SelectItem value="sale">For Sale</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Property Type Filter */}
            <div data-testid="filter-property-type">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Property Type
              </label>
              <Select
                value={filters.propertyType || "all"}
                onValueChange={(value) => updateFilter("propertyType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="office">Office</SelectItem>
                  <SelectItem value="shop">Shop</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Beds & Baths Filter */}
            <div data-testid="filter-bedrooms">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Beds & Baths
              </label>
              <Select
                value={filters.bedrooms?.toString() || "any"}
                onValueChange={(value) => updateFilter("bedrooms", value === "any" ? undefined : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price Filter */}
            <div data-testid="filter-price">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Price
              </label>
              <Select
                value={
                  filters.minPrice && filters.maxPrice
                    ? `${filters.minPrice}-${filters.maxPrice}`
                    : "any"
                }
                onValueChange={(value) => {
                  if (value === "any") {
                    updateFilter("minPrice", undefined);
                    updateFilter("maxPrice", undefined);
                  } else {
                    const [min, max] = value.split("-");
                    updateFilter("minPrice", min);
                    updateFilter("maxPrice", max);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Price</SelectItem>
                  <SelectItem value="0-50000">50,000 रुपैयाँ भन्दा कम | Under Rs. 50,000</SelectItem>
                  <SelectItem value="50000-100000">50,000 - 1,00,000 रुपैयाँ | Rs. 50K - 1L</SelectItem>
                  <SelectItem value="100000-500000">1,00,000 - 5,00,000 रुपैयाँ | Rs. 1L - 5L</SelectItem>
                  <SelectItem value="500000-999999999">5,00,000 रुपैयाँ भन्दा माथि | Above Rs. 5L</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* More Filters & Actions */}
            <div className="flex flex-col space-y-2 md:space-y-2" data-testid="filter-actions">
              <Button
                variant="outline"
                size="sm"
                className="text-muted-foreground hover:bg-primary/5 hover:text-primary hover:border-primary smooth-transition"
                data-testid="button-more-filters"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">More Filters</span>
                <span className="sm:hidden">More</span>
              </Button>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={onSaveSearch}
                  className="flex-1 bg-primary hover:bg-primary/90 smooth-transition"
                  data-testid="button-save-search"
                >
                  <span className="hidden sm:inline">Save Search</span>
                  <span className="sm:hidden">Save</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClearFilters}
                  className="flex-1 hover:bg-destructive/5 hover:text-destructive hover:border-destructive smooth-transition"
                  data-testid="button-clear-filters"
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile: Quick action buttons */}
          <div className="md:hidden mt-4 flex space-x-3">
            <Button
              onClick={onSaveSearch}
              className="flex-1 bg-primary hover:bg-primary/90 smooth-transition"
              data-testid="button-save-search-mobile"
            >
              Save Search
            </Button>
            <Button
              variant="outline"
              onClick={onClearFilters}
              className="flex-1 hover:bg-destructive/5 hover:text-destructive hover:border-destructive smooth-transition"
              data-testid="button-clear-filters-mobile"
            >
              Clear All
            </Button>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}