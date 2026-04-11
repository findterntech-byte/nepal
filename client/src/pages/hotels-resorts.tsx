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
  propertyType: string;
  businessName: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail?: string;
  whatsappAvailable?: boolean;
  website?: string;
  starRating?: number;
  numberOfRooms?: number;
  checkInTime?: string;
  checkOutTime?: string;
  pricePerNight?: number;
  pricePerNightMin?: number;
  pricePerNightMax?: number;
  city: string;
  state?: string;
  country?: string;
  fullAddress?: string;
  areaName?: string;
  parkingAvailable?: boolean;
  wifiAvailable?: boolean;
  restaurantAvailable?: boolean;
  barAvailable?: boolean;
  roomService?: boolean;
  laundryService?: boolean;
  gymAvailable?: boolean;
  poolAvailable?: boolean;
  spaAvailable?: boolean;
  conferenceRoom?: boolean;
  banquetHall?: boolean;
  airportTransfer?: boolean;
  petFriendly?: boolean;
  onlineBookingAvailable?: boolean;
  instantBooking?: boolean;
  freeCancellation?: boolean;
  payAtHotel?: boolean;
  workingHours?: string;
  languagesKnown?: string;
  images?: string[];
  isActive: boolean;
  isFeatured?: boolean;
  viewCount?: number;
  createdAt?: string;
}

export default function HotelsResortsPage() {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");

  const { data: services = [], isLoading } = useQuery<ServiceItem[]>({
    queryKey: ["hotels-resorts-public"],
    queryFn: async () => {
      const res = await fetch("/api/hotels-resorts");
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
      const matchesType = selectedType === "all" || service.propertyType === selectedType;
      const matchesCity = selectedCity === "all" || service.city === selectedCity;
      const matchesRating = selectedRating === "all" || 
        (selectedRating === "5" && service.starRating === 5) ||
        (selectedRating === "4" && service.starRating === 4) ||
        (selectedRating === "3" && service.starRating === 3) ||
        (selectedRating === "budget" && !service.starRating);
      return matchesSearch && matchesType && matchesCity && matchesRating && service.isActive;
    });
  }, [services, searchQuery, selectedType, selectedCity, selectedRating]);

  const cities = useMemo(() => {
    const uniqueCities = [...new Set(services.filter(s => s.city).map(s => s.city))];
    return uniqueCities;
  }, [services]);

  const handleServiceClick = (id: string) => {
    setLocation(`/hotels-resorts/${id}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Hotels & Resorts</h1>
          <p className="text-muted-foreground">Find the best hotels, resorts, and accommodation</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Input
            placeholder="Search hotels, resorts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="md:w-1/4"
          />
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="md:w-1/4">
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Hotel">Hotel</SelectItem>
              <SelectItem value="Resort">Resort</SelectItem>
              <SelectItem value="Guest House">Guest House</SelectItem>
              <SelectItem value="Homestay">Homestay</SelectItem>
              <SelectItem value="Hostel">Hostel</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedRating} onValueChange={setSelectedRating}>
            <SelectTrigger className="md:w-1/4">
              <SelectValue placeholder="Star Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Star</SelectItem>
              <SelectItem value="4">4 Star</SelectItem>
              <SelectItem value="3">3 Star</SelectItem>
              <SelectItem value="budget">Budget</SelectItem>
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
          <div className="text-center py-12 text-muted-foreground">No properties found</div>
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
                  <div className="h-48 bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                    <span className="text-white text-4xl">🏨</span>
                  </div>
                )}
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                    {service.starRating && <Badge>{service.starRating} ★</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{service.propertyType}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p><strong>Location:</strong> {service.city}, {service.state}</p>
                    {service.pricePerNight && (
                      <p><strong>Price:</strong> ₹{service.pricePerNight}/night</p>
                    )}
                    {service.numberOfRooms && (
                      <p><strong>Rooms:</strong> {service.numberOfRooms}</p>
                    )}
                  </div>
                  <div className="mt-4 flex gap-2 flex-wrap">
                    {service.wifiAvailable && <Badge variant="outline">WiFi</Badge>}
                    {service.parkingAvailable && <Badge variant="outline">Parking</Badge>}
                    {service.poolAvailable && <Badge variant="outline">Pool</Badge>}
                    {service.restaurantAvailable && <Badge variant="outline">Restaurant</Badge>}
                    {service.gymAvailable && <Badge variant="outline">Gym</Badge>}
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