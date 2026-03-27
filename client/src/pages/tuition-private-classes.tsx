
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { CategoryListingCard } from "@/components/category-listing-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function TuitionPrivateClasses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ["tuition-private-classes"],
    queryFn: async () => {
      const response = await fetch("/api/admin/tuition-private-classes");
      if (!response.ok) throw new Error("Failed to fetch listings");
      return response.json();
    },
  });

  const filteredListings = listings.filter((listing: any) => {
    if (!listing.isActive) return false;
    if (searchTerm && !listing.title?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (subjectFilter !== "all" && listing.subjectCategory !== subjectFilter) return false;
    if (cityFilter !== "all" && listing.city !== cityFilter) return false;
    return true;
  });

  const cities = [...new Set(listings.map((l: any) => l.city).filter(Boolean))];
  const subjects = [...new Set(listings.map((l: any) => l.subjectCategory).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <section className="bg-gradient-to-r from-purple-100 to-purple-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Tuition & Private Classes</h1>
          <p className="text-lg text-gray-600">Find the best tutors and private classes for your educational needs</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search tuition classes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Subject Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={cityFilter} onValueChange={setCityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="City" />
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

        {isLoading ? (
          <div className="text-center py-12">Loading...</div>
        ) : filteredListings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No tuition classes found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing: any) => (
              <CategoryListingCard
                key={listing.id}
                listing={listing}
                categorySlug="tuition-private-classes"
              />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
