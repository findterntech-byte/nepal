
import { useQuery } from "@tanstack/react-query";
import { Heart, MapPin, Users, BookOpen, Clock, Star, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useState } from "react";
import useWishlist from "@/hooks/useWishlist";
import { Link } from "wouter";

export default function TuitionPrivateClassesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ["/api/admin/tuition-private-classes"],
  });

  const activeListing = listings.filter((listing: any) => listing.isActive);

  const filteredListings = activeListing.filter((listing: any) => {
    if (searchTerm && !listing.title?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (cityFilter !== "all" && listing.city !== cityFilter) return false;
    if (subjectFilter !== "all" && listing.subject !== subjectFilter) return false;
    return true;
  });

  const cities = [...new Set(activeListing.map((l: any) => l.city).filter(Boolean))];
  const subjects = [...new Set(activeListing.map((l: any) => l.subject).filter(Boolean))];

  if (isLoading) {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section with Gradient Background */}
      <section className="bg-gradient-to-r from-blue-600 via-blue-500 to-teal-500 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              ट्युसन र निजी कक्षाहरू | Tuition & Private Classes
            </h1>
            <p className="text-xl text-white/90 mb-6">
              Find the best tutors and coaching centers in Nepal
            </p>
            <div className="flex items-center gap-4">
              <Badge className="bg-white/20 text-white text-sm px-4 py-2">
                {filteredListings.length} Classes Available
              </Badge>
              <Badge className="bg-white/20 text-white text-sm px-4 py-2">
                <BookOpen className="w-4 h-4 mr-2" />
                All Subjects
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="container mx-auto px-4 py-8">
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by class name, teacher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={cityFilter} onValueChange={setCityFilter}>
                <SelectTrigger>
                  <MapPin className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="All Cities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger>
                  <BookOpen className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Listings Grid */}
      <section className="container mx-auto px-4 pb-16">
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredListings.length}</span> results
          </p>
        </div>

        {filteredListings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No classes found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing: any) => (
              <Card key={listing.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                {/* Image Section */}
                <div className="relative h-56 bg-gradient-to-br from-blue-100 to-teal-100 overflow-hidden">
                  {listing.photos && listing.photos.length > 0 ? (
                    <img
                      src={listing.photos[0]}
                      alt={listing.title}
                      className="w-full h-full  group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-blue-300" />
                    </div>
                  )}
                  
                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className="bg-green-500 text-white">
                      {listing.listingType || 'उपलब्ध'}
                    </Badge>
                    {listing.isFeatured && (
                      <Badge className="bg-yellow-500 text-white">
                        Featured
                      </Badge>
                    )}
                  </div>

                  {/* Favorite Button */}
                  <FavoriteButton listing={listing} />
                </div>

                {/* Content Section */}
                <CardContent className="p-5">
                  {/* Price and Duration */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        {listing.feeAmount ? `NPR ${listing.feeAmount.toLocaleString()}` : 'Contact for Fee'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {listing.duration || 'प्रति महिना'}
                      </div>
                    </div>
                    {listing.rating && (
                      <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold">{listing.rating}</span>
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {listing.title}
                  </h3>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span className="line-clamp-1">
                      {listing.city}{listing.areaName && `, ${listing.areaName}`}
                    </span>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-3 gap-2 mb-4 pt-3 border-t">
                    {listing.subject && (
                      <div className="flex items-center gap-1 text-xs">
                        <BookOpen className="w-3 h-3 text-blue-500" />
                        <span className="truncate">{listing.subject}</span>
                      </div>
                    )}
                    {listing.classLevel && (
                      <div className="flex items-center gap-1 text-xs">
                        <Users className="w-3 h-3 text-green-500" />
                        <span className="truncate">{listing.classLevel}</span>
                      </div>
                    )}
                    {listing.timeSlot && (
                      <div className="flex items-center gap-1 text-xs">
                        <Clock className="w-3 h-3 text-purple-500" />
                        <span className="truncate">{listing.timeSlot}</span>
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  <Link href={`/tuition-private-classes/${listing.id}`}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      विस्तृत जानकारी हेर्नुहोस्
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}

function FavoriteButton({ listing }: { listing: any }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const active = isInWishlist(listing.id);

  return (
    <button
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      onClick={() => toggleWishlist({ id: listing.id, title: listing.title, href: `/tuition-private-classes/${listing.id}`, photo: listing.photos?.[0] })}
      className={`absolute top-3 right-3 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow transition-colors ${active ? 'bg-red-50' : 'bg-white'}`}
    >
      <Heart className={`w-5 h-5 ${active ? 'text-red-500' : 'text-gray-600'}`} />
    </button>
  );
}
