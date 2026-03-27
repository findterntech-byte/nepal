import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Home as HomeIcon, MapPin, Filter, LayoutGrid, LayoutList, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { CategoryListingCard } from "@/components/category-listing-card";
import Header from "@/components/header";
import Footer from "@/components/footer";
import SUBCATEGORY_API_MAP, { SUBCATEGORY_NAMES } from "@/lib/subcategory-mapping";
import { useState } from "react";

// moved to shared module

export default function SubcategoryPage() {
  const params = useParams();
  // support both routes:
  // - /category/:categorySlug/subcategory/:subcategorySlug
  // - /subcategory/:name
  const categoryId = (params as any).categorySlug || null;
  const subcategorySlug = (params as any).subcategorySlug || (params as any).name || "";

  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Fetch category data
  const { data: categoriesData, isLoading: categoryLoading } = useQuery({
    queryKey: ["/api/admin/categories"],
    queryFn: async () => {
      const response = await fetch("/api/admin/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      return response.json();
    },
  });

  const categories = (categoriesData ?? []) as any[];

  // Find the current category
  const category = categories.find((cat: any) => cat.id === categoryId);

  // Fetch subcategory data to ensure it exists and get its name/slug
  const { data: subcategoryData } = useQuery({
    queryKey: ["subcategory", categoryId, subcategorySlug],
    queryFn: async () => {
      const response = await fetch(`/api/admin/categories`);
      if (!response.ok) throw new Error("Failed to fetch categories");
      const categories = await response.json();

      const category = categories.find((c: any) => c.id === categoryId);
      if (!category) return null;

      // Decode the URL slug to match against database slugs
      const decodedSlug = decodeURIComponent(subcategorySlug || '');

      const subcategory = category.subcategories?.find(
        (s: any) => s.slug === decodedSlug || s.slug === subcategorySlug || s.name === decodedSlug
      );

      return subcategory;
    },
  });

  // Get API endpoint for this subcategory
  const decodedSubcategorySlug = decodeURIComponent(subcategorySlug || "");
  const normalizedSubcategorySlug = decodedSubcategorySlug.trim().replace(/\s+/g, " ");
  const normalizedSubcategoryKey = normalizedSubcategorySlug.replace(/\s/g, "");

  const apiMapCandidates = [
    subcategoryData?.slug,
    subcategoryData?.name,
    subcategorySlug,
    decodedSubcategorySlug,
    normalizedSubcategorySlug,
    normalizedSubcategoryKey,
  ].filter(Boolean) as string[];

  const endpoint = apiMapCandidates.reduce<string | undefined>((acc, key) => {
    if (acc) return acc;
    return SUBCATEGORY_API_MAP[key];
  }, undefined);

  const subcategoryName =
    subcategoryData?.name ||
    SUBCATEGORY_NAMES[(subcategoryData?.slug as any) || ""] ||
    SUBCATEGORY_NAMES[subcategorySlug || ""] ||
    normalizedSubcategorySlug ||
    subcategorySlug;

  // Fetch listings for this subcategory
  const { data: listingsData, isLoading: listingsLoading } = useQuery({
    queryKey: [endpoint],
    enabled: !!endpoint,
    queryFn: async () => {
      if (!endpoint) return [];
      const endpointString = endpoint as string;
      const response = await fetch(endpointString);
      if (!response.ok) throw new Error("Failed to fetch listings");
      return response.json();
    },
  });

  const listings = (listingsData ?? []) as any[];

  // Filter listings
  const filteredListings = listings.filter((listing: any) => {
    const isListingActive =
      typeof listing?.isActive === "boolean"
        ? listing.isActive
        : typeof listing?.active === "boolean"
          ? listing.active
          : true;

    if (!isListingActive) return false;
    if (searchTerm && !listing.title?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (cityFilter !== "all" && listing.city !== cityFilter) return false;
    return true;
  });

  const cities = Array.from(
    new Set<string>(listings.map((l: any) => l.city).filter(Boolean))
  );

  if (categoryLoading || listingsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!endpoint) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Subcategory Not Found</h2>
          <Link href="/">
            <Button>
              <HomeIcon className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-100 to-purple-50 py-12">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors flex items-center">
              <HomeIcon className="w-4 h-4 mr-1" />
              Home
            </Link>
            <span>{'>'}</span>
         
            <span className="text-foreground font-medium">{subcategoryName}</span>
          </nav>

          {/* Page Header */}
          <div className="flex items-center justify-between">
           

            {/* View Toggle */}
            <div className="hidden md:flex items-center space-x-2 bg-white rounded-lg p-1 shadow-sm border">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="gap-2"
              >
                <LayoutGrid className="w-4 h-4" />
                Grid
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="gap-2"
              >
                <LayoutList className="w-4 h-4" />
                List
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder={`Search ${subcategoryName.toLowerCase()}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={cityFilter} onValueChange={setCityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Cities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold">{filteredListings.length}</span> results
          </p>
        </div>

        {filteredListings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No listings found</p>
            </CardContent>
          </Card>
        ) : (
          <div className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }>
            {filteredListings.map((listing: any) => (
              <CategoryListingCard
                key={listing.id}
                listing={listing}
                categorySlug={subcategorySlug || ''}
              />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}