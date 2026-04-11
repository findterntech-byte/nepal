import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ServiceItem {
  id: string;
  title: string;
  description?: string;
  serviceCategory: string;
  businessName: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail?: string;
  whatsappAvailable?: boolean;
  website?: string;
  serviceAreas?: string;
  operatingCountries?: string;
  operatingStates?: string;
  operatingCities?: string;
  tourTypes?: string[];
  packageTypes?: string[];
  priceRange?: string;
  startingPrice?: number;
  maxPrice?: number;
  pickupAvailable?: boolean;
  dropAvailable?: boolean;
  guideAvailable?: boolean;
  accommodationIncluded?: boolean;
  mealIncluded?: boolean;
  transportIncluded?: boolean;
  insuranceIncluded?: boolean;
  visaAssistance?: boolean;
  flightBooking?: boolean;
  hotelBooking?: boolean;
  carRental?: boolean;
  domesticTours?: boolean;
  internationalTours?: boolean;
  adventureTours?: boolean;
  beachTours?: boolean;
  hillStationTours?: boolean;
  heritageTours?: boolean;
  wildlifeTours?: boolean;
  pilgrimageTours?: boolean;
  honeymoonTours?: boolean;
  familyTours?: boolean;
  corporateTours?: boolean;
  customPackages?: boolean;
  workingHours?: string;
  languagesKnown?: string;
  certifications?: string;
  experienceYears?: number;
  city?: string;
  state?: string;
  country?: string;
  fullAddress?: string;
  images?: string[];
  isActive: boolean;
  isFeatured?: boolean;
  viewCount?: number;
  createdAt?: string;
}

export default function ToursTravelsPage() {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");

  const { data: services = [], isLoading } = useQuery<ServiceItem[]>({
    queryKey: ["tours-travels-public"],
    queryFn: async () => {
      const res = await fetch("/api/tours-travels");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesSearch = searchQuery === "" ||
        service.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.city?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || service.serviceCategory === selectedCategory;
      const matchesCity = selectedCity === "all" || service.city === selectedCity;
      return matchesSearch && matchesCategory && matchesCity && service.isActive;
    });
  }, [services, searchQuery, selectedCategory, selectedCity]);

  const cities = useMemo(() => {
    const uniqueCities = [...new Set(services.filter(s => s.city).map(s => s.city))];
    return uniqueCities;
  }, [services]);

  const handleServiceClick = (id: string) => {
    setLocation(`/tours-travels/${id}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Tours & Travels</h1>
          <p className="text-muted-foreground">Find the best travel agencies, tour operators, and travel services</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Input
            placeholder="Search tours, travel agencies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="md:w-1/3"
          />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="md:w-1/4">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Tour Operator">Tour Operator</SelectItem>
              <SelectItem value="Travel Agency">Travel Agency</SelectItem>
              <SelectItem value="Adventure Tour">Adventure Tour</SelectItem>
              <SelectItem value="Car Rental">Car Rental</SelectItem>
              <SelectItem value="Visa Consultant">Visa Consultant</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="md:w-1/4">
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

        {isLoading ? (
          <div className="text-center py-12">Loading...</div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No services found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <Card
                key={service.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleServiceClick(service.id)}
              >
                {service.images && service.images.length > 0 ? (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={service.images[0]}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <span className="text-white text-4xl">✈️</span>
                  </div>
                )}
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                    {service.isFeatured && <Badge variant="secondary">Featured</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{service.businessName}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p><strong>Category:</strong> {service.serviceCategory}</p>
                    <p><strong>Location:</strong> {service.city}, {service.state}</p>
                    {service.startingPrice && (
                      <p><strong>Starting from:</strong> ₹{service.startingPrice}</p>
                    )}
                    {service.experienceYears && (
                      <p><strong>Experience:</strong> {service.experienceYears} years</p>
                    )}
                  </div>
                  <div className="mt-4 flex gap-2 flex-wrap">
                    {service.domesticTours && <Badge variant="outline">Domestic</Badge>}
                    {service.internationalTours && <Badge variant="outline">International</Badge>}
                    {service.adventureTours && <Badge variant="outline">Adventure</Badge>}
                    {service.honeymoonTours && <Badge variant="outline">Honeymoon</Badge>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}