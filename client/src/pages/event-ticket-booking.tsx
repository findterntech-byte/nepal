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
  eventType: string;
  businessName: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail?: string;
  whatsappAvailable?: boolean;
  website?: string;
  venueName?: string;
  venueAddress?: string;
  city: string;
  state?: string;
  country?: string;
  eventDate?: string;
  eventEndDate?: string;
  eventTime?: string;
  eventEndTime?: string;
  ticketPriceMin?: number;
  ticketPriceMax?: number;
  bookingOpen?: boolean;
  earlyBirdAvailable?: boolean;
  groupDiscount?: boolean;
  studentDiscount?: boolean;
  seniorDiscount?: boolean;
  childDiscount?: boolean;
  freeEntry?: boolean;
  vipSeating?: boolean;
  generalSeating?: boolean;
  onlineBooking?: boolean;
  payAtVenue?: boolean;
  instantConfirmation?: boolean;
  ageRestriction?: string;
  language?: string;
  duration?: string;
  organizerName?: string;
  artistPerformer?: string;
  featuredEvent?: boolean;
  popularEvent?: boolean;
  capacity?: number;
  workingHours?: string;
  images?: string[];
  isActive: boolean;
  isFeatured?: boolean;
  viewCount?: number;
  createdAt?: string;
}

export default function EventTicketBookingPage() {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedPrice, setSelectedPrice] = useState("all");

  const { data: services = [], isLoading } = useQuery<ServiceItem[]>({
    queryKey: ["event-tickets-public"],
    queryFn: async () => {
      const res = await fetch("/api/event-tickets");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesSearch = searchQuery === "" ||
        service.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.artistPerformer?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === "all" || service.eventType === selectedType;
      const matchesCity = selectedCity === "all" || service.city === selectedCity;
      const matchesPrice = selectedPrice === "all" || 
        (selectedPrice === "free" && service.freeEntry) ||
        (selectedPrice === "paid" && !service.freeEntry) ||
        (selectedPrice === "under500" && service.ticketPriceMin && service.ticketPriceMin < 500) ||
        (selectedPrice === "500to1000" && service.ticketPriceMin >= 500 && service.ticketPriceMin <= 1000) ||
        (selectedPrice === "above1000" && service.ticketPriceMin && service.ticketPriceMin > 1000);
      return matchesSearch && matchesType && matchesCity && matchesPrice && service.isActive;
    });
  }, [services, searchQuery, selectedType, selectedCity, selectedPrice]);

  const cities = useMemo(() => {
    const uniqueCities = [...new Set(services.filter(s => s.city).map(s => s.city))];
    return uniqueCities;
  }, [services]);

  const handleServiceClick = (id: string) => {
    setLocation(`/event-tickets/${id}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Event & Movie Tickets</h1>
          <p className="text-muted-foreground">Book tickets for movies, concerts, sports, and events</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Input
            placeholder="Search events, movies, artists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="md:w-1/4"
          />
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="md:w-1/4">
              <SelectValue placeholder="Event Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Movie">Movie</SelectItem>
              <SelectItem value="Concert">Concert</SelectItem>
              <SelectItem value="Theater">Theater</SelectItem>
              <SelectItem value="Sports">Sports</SelectItem>
              <SelectItem value="Comedy Show">Comedy Show</SelectItem>
              <SelectItem value="Festival">Festival</SelectItem>
              <SelectItem value="Exhibition">Exhibition</SelectItem>
              <SelectItem value="Workshop">Workshop</SelectItem>
              <SelectItem value="Conference">Conference</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedPrice} onValueChange={setSelectedPrice}>
            <SelectTrigger className="md:w-1/4">
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="under500">Under ₹500</SelectItem>
              <SelectItem value="500to1000">₹500 - ₹1000</SelectItem>
              <SelectItem value="above1000">Above ₹1000</SelectItem>
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
          <div className="text-center py-12 text-muted-foreground">No events found</div>
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
                  <div className="h-48 bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
                    <span className="text-white text-4xl">🎫</span>
                  </div>
                )}
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                    <div className="flex gap-1">
                      {service.featuredEvent && <Badge variant="secondary">Featured</Badge>}
                      {service.popularEvent && <Badge>Popular</Badge>}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{service.eventType}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {service.eventDate && (
                      <p><strong>Date:</strong> {new Date(service.eventDate).toLocaleDateString()}</p>
                    )}
                    {service.eventTime && (
                      <p><strong>Time:</strong> {service.eventTime}</p>
                    )}
                    <p><strong>Venue:</strong> {service.venueName || service.city}</p>
                    <p><strong>Price:</strong> {service.freeEntry ? "Free" : `₹${service.ticketPriceMin} - ₹${service.ticketPriceMax}`}</p>
                  </div>
                  <div className="mt-4 flex gap-2 flex-wrap">
                    {service.onlineBooking && <Badge variant="outline">Online Booking</Badge>}
                    {service.vipSeating && <Badge variant="outline">VIP</Badge>}
                    {service.studentDiscount && <Badge variant="outline">Student Discount</Badge>}
                    {service.freeEntry && <Badge variant="outline">Free Entry</Badge>}
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