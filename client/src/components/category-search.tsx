import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

interface CategorySearchProps {
  categorySlug: string;
  categoryName: string;
  showResults?: boolean;
}

export default function CategorySearch({
  categorySlug,
  categoryName,
  showResults = true,
}: CategorySearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Map category slugs to category filter names
  const categoryFilterMap: Record<string, string> = {
    "education-learning": "education-learning",
    "electronics-technology": "electronics-technology",
    "fashion-lifestyle": "fashion-lifestyle",
    "real-estate-property": "real-estate-property",
    "vehicles-transportation": "vehicles-transportation",
    "services": "services",
    "furniture-home": "furniture-home",
  };

  const categoryFilter = categoryFilterMap[categorySlug] || "";

  const { data: searchResults } = useQuery({
    queryKey: ["category-search", searchQuery, categoryFilter],
    queryFn: async () => {
      if (!searchQuery || searchQuery.length < 2) return { results: {} };
      const categoryParam = categoryFilter ? `&category=${encodeURIComponent(categoryFilter)}` : "";
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}&limit=6${categoryParam}`
      );
      if (!res.ok) return { results: {} };
      return res.json();
    },
    enabled: !!searchQuery && searchQuery.length >= 2 && showResults,
  });

  const totalResults = searchResults
    ? Object.values(searchResults.results || {}).reduce(
        (sum: number, arr: any) =>
          sum + (Array.isArray(arr) ? arr.length : 0),
        0
      )
    : 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.length >= 2) {
      setIsSearchOpen(true);
    }
  };

  function getItemLink(group: string, item: any) {
    const r = item?.raw || item;
    if (!r) return "#";

    const buildCategoryItemHref = (categoryLabel: string, id: string) => `/${encodeURIComponent(categoryLabel)}/${id}`;

    const groupToCategoryLabel: Record<string, string> = {
      fashion: 'Fashion & Beauty Products',
      jewelry: 'Jewelry & Accessories',
      sareeClothing: 'Saree & Clothing Shopping',
      furniture: 'Furniture & Interior Decor',
      electronics: 'Electronics & Gadgets',
      phones: 'Phones, Tablets & Accessories',
      secondHandPhones: 'Second Hand Phones & Accessories',
      computerRepair: 'Computer, Mobile & Laptop Repair Services',
      // cyberCafe: 'Cyber Café / Internet Services',
      telecommunication: 'Telecommunication Services',
      serviceCentre: 'Service Centre / Warranty',
      household: 'Household Services',
      eventDecoration: 'Event & Decoration Services',
      healthWellness: 'Health & Wellness Services',
      pharmacy: 'Pharmacy & Medical Stores',
      tuition: 'Tuition & Private Classes',
      languageClasses: 'Language Classes',
      dance: 'Dance, Karate, Gym & Yoga',
      academies: 'Academies - Music, Arts, Sports',
      skillTraining: 'Skill Training & Certification',
      schools: 'Schools, Colleges & Coaching',
      educationalConsultancy: 'Educational Consultancy & Study Abroad',
      ebooks: 'E-Books & Online Courses',
      cricketTraining: 'Cricket & Sports Training',
      secondHandCars: 'Second Hand Cars & Bikes',
      showrooms: 'Showrooms',
      carBikeRentals: 'Car & Bike Rentals',
      vehicleLicense: 'Vehicle License Classes',
      transportation: 'Transportation & Moving Services',
      constructionMaterials: 'Construction Materials',
      hostelPg: 'Hostel & PG',
      rentalListings: 'Rental Listings',
    };

    switch (group) {
      case "properties":
        return `/properties/${r.id}`;
      case "rentals":
        return `/properties/rent/${r.id}`;
      case "propertyDeals":
        return `/properties/deal/${r.id}`;
      case "commercialProperties":
        return `/properties/commercial/${r.id}`;
      case "officeSpaces":
        return `/properties/office/${r.id}`;
      case "cars":
        return `/vehicles/${r.id}`;
      case "blogPosts":
        return `/blog/${r.slug || r.id}`;
      case "articles":
        return `/articles/${r.id}`;
      case "categories":
        return `/category/${r.slug || r.id}`;
      case "subcategories":
        return `/subcategory/${r.slug || r.id}`;
      case "users":
        return `/profile/${r.id}`;
      default:
        if (r.id) {
          const label = groupToCategoryLabel[group] || r.category || r.categoryName || r.subcategory || r.subcategoryName || group;
          return buildCategoryItemHref(label, r.id);
        }
        return "#";
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="w-full">
        <div className="relative">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder={`Search in ${categoryName}...`}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.length < 2) {
                    setIsSearchOpen(false);
                  } else {
                    setIsSearchOpen(true);
                  }
                }}
                className="pl-10 pr-4"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setIsSearchOpen(false);
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <Button type="submit" className="px-6">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>

          {/* Search Results Dropdown */}
          {isSearchOpen && searchQuery.length >= 2 && showResults && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-lg shadow-lg z-50">
              {totalResults === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No results found for "{searchQuery}" in {categoryName}
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  {Object.entries(searchResults?.results || {}).map(
                    ([group, items]: any) =>
                      items.length > 0 && (
                        <div key={group} className="border-b last:border-b-0">
                          <div className="px-4 py-2 bg-muted font-semibold text-sm">
                            {group} ({items.length})
                          </div>
                          {items.map((item: any) => (
                            <Link
                              key={item.id}
                              href={getItemLink(group, item)}
                              onClick={() => setIsSearchOpen(false)}
                            >
                              <a className="block px-4 py-2 hover:bg-muted transition-colors border-b last:border-b-0">
                                <div className="font-medium truncate">
                                  {item.title || item.name}
                                </div>
                                {item.snippet && (
                                  <div className="text-sm text-muted-foreground truncate">
                                    {item.snippet.substring(0, 60)}...
                                  </div>
                                )}
                              </a>
                            </Link>
                          ))}
                        </div>
                      )
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
