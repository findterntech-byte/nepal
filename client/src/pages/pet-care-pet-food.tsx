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
  city: string;
  state?: string;
  country?: string;
  fullAddress?: string;
  petTypes?: string[];
  petGrooming?: boolean;
  petBoarding?: boolean;
  petDaycare?: boolean;
  petTraining?: boolean;
  petWalking?: boolean;
  petSitting?: boolean;
  veterinaryService?: boolean;
  petPhotography?: boolean;
  petInsurance?: boolean;
  homeVisit?: boolean;
  clinicVisit?: boolean;
  onlineConsultation?: boolean;
  emergencyService?: boolean;
  petFoodAvailable?: boolean;
  petToysAvailable?: boolean;
  petAccessoriesAvailable?: boolean;
  organicPetFood?: boolean;
  grainFreeFood?: boolean;
  prescriptionFood?: boolean;
  puppyFood?: boolean;
  adultDogFood?: boolean;
  seniorDogFood?: boolean;
  catFood?: boolean;
  fishFood?: boolean;
  birdFood?: boolean;
  deliveryAvailable?: boolean;
  freeDelivery?: boolean;
  licensedVet?: boolean;
  certifiedTrainer?: boolean;
  experienceYears?: number;
  certifications?: string;
  consultationFee?: number;
  groomingPrice?: number;
  boardingPricePerDay?: number;
  daycarePricePerDay?: number;
  workingHours?: string;
  languagesKnown?: string;
  images?: string[];
  isActive: boolean;
  isFeatured?: boolean;
  viewCount?: number;
  createdAt?: string;
}

export default function PetCarePetFoodPage() {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");

  const { data: services = [], isLoading } = useQuery<ServiceItem[]>({
    queryKey: ["pet-care-public"],
    queryFn: async () => {
      const res = await fetch("/api/pet-care");
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
    setLocation(`/pet-care/${id}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Pet Care & Pet Food</h1>
          <p className="text-muted-foreground">Find pet shops, grooming, veterinary, and pet care services</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Input
            placeholder="Search pet services, shops..."
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
              <SelectItem value="Pet Shop">Pet Shop</SelectItem>
              <SelectItem value="Pet Grooming">Pet Grooming</SelectItem>
              <SelectItem value="Pet Boarding">Pet Boarding</SelectItem>
              <SelectItem value="Pet Daycare">Pet Daycare</SelectItem>
              <SelectItem value="Pet Training">Pet Training</SelectItem>
              <SelectItem value="Veterinary Clinic">Veterinary Clinic</SelectItem>
              <SelectItem value="Pet Food Store">Pet Food Store</SelectItem>
              <SelectItem value="Pet Walking">Pet Walking</SelectItem>
              <SelectItem value="Pet Sitting">Pet Sitting</SelectItem>
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
                  <div className="h-48 bg-gradient-to-r from-amber-500 to-yellow-500 flex items-center justify-center">
                    <span className="text-white text-4xl">🐕</span>
                  </div>
                )}
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                    {service.isFeatured && <Badge variant="secondary">Featured</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{service.serviceCategory}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p><strong>Location:</strong> {service.city}, {service.state}</p>
                    {service.experienceYears && (
                      <p><strong>Experience:</strong> {service.experienceYears} years</p>
                    )}
                    {service.consultationFee && (
                      <p><strong>Consultation:</strong> ₹{service.consultationFee}</p>
                    )}
                  </div>
                  <div className="mt-4 flex gap-2 flex-wrap">
                    {service.petGrooming && <Badge variant="outline">Grooming</Badge>}
                    {service.petBoarding && <Badge variant="outline">Boarding</Badge>}
                    {service.petDaycare && <Badge variant="outline">Daycare</Badge>}
                    {service.petTraining && <Badge variant="outline">Training</Badge>}
                    {service.veterinaryService && <Badge variant="outline">Vet</Badge>}
                    {service.petFoodAvailable && <Badge variant="outline">Pet Food</Badge>}
                    {service.deliveryAvailable && <Badge variant="outline">Delivery</Badge>}
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