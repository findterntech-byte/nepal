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
  farmSize?: string;
  farmType?: string;
  organicFarming?: boolean;
  conventionalFarming?: boolean;
  hydroponics?: boolean;
  greenhouseFarming?: boolean;
  dairyFarming?: boolean;
  poultryFarming?: boolean;
  fishFarming?: boolean;
  goatFarming?: boolean;
  beeKeeping?: boolean;
  seeds?: boolean;
  fertilizers?: boolean;
  pesticides?: boolean;
  agriculturalEquipment?: boolean;
  irrigationSystem?: boolean;
  dripIrrigation?: boolean;
  sprinklerIrrigation?: boolean;
  solarPower?: boolean;
  farmMachinery?: boolean;
  tractorAvailable?: boolean;
  harvestorAvailable?: boolean;
  organicCertified?: boolean;
  fssaiCertified?: boolean;
  govtCertified?: boolean;
  qualityCheck?: boolean;
  labTesting?: boolean;
  packagingAvailable?: boolean;
  deliveryAvailable?: boolean;
  freeDelivery?: boolean;
  coldStorage?: boolean;
  processingUnit?: boolean;
  storageFacility?: boolean;
  consultingServices?: boolean;
  soilTesting?: boolean;
  cropConsultation?: boolean;
  experienceYears?: number;
  certifications?: string;
  productPriceMin?: number;
  productPriceMax?: number;
  minimumOrderQuantity?: number;
  wholesaleAvailable?: boolean;
  retailAvailable?: boolean;
  exportAvailable?: boolean;
  workingHours?: string;
  languagesKnown?: string;
  images?: string[];
  isActive: boolean;
  isFeatured?: boolean;
  viewCount?: number;
  createdAt?: string;
}

export default function AgricultureSeedsFarmingPage() {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const { data: services = [], isLoading } = useQuery<ServiceItem[]>({
    queryKey: ["agriculture-public"],
    queryFn: async () => {
      const res = await fetch("/api/agriculture");
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
      const matchesType = selectedType === "all" || 
        (selectedType === "organic" && service.organicFarming) ||
        (selectedType === "conventional" && service.conventionalFarming) ||
        (selectedType === "greenhouse" && service.greenhouseFarming) ||
        (selectedType === "dairy" && service.dairyFarming) ||
        (selectedType === "poultry" && service.poultryFarming) ||
        (selectedType === "fish" && service.fishFarming);
      return matchesSearch && matchesCategory && matchesCity && matchesType && service.isActive;
    });
  }, [services, searchQuery, selectedCategory, selectedCity, selectedType]);

  const cities = useMemo(() => {
    const uniqueCities = [...new Set(services.filter(s => s.city).map(s => s.city))];
    return uniqueCities;
  }, [services]);

  const handleServiceClick = (id: string) => {
    setLocation(`/agriculture/${id}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Agriculture, Seeds & Farming</h1>
          <p className="text-muted-foreground">Find farms, seed suppliers, agricultural equipment, and farming services</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Input
            placeholder="Search farms, seeds, equipment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="md:w-1/4"
          />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="md:w-1/4">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Farm Owner">Farm Owner</SelectItem>
              <SelectItem value="Seed Supplier">Seed Supplier</SelectItem>
              <SelectItem value="Fertilizer Supplier">Fertilizer Supplier</SelectItem>
              <SelectItem value="Pesticide Supplier">Pesticide Supplier</SelectItem>
              <SelectItem value="Agricultural Equipment">Agricultural Equipment</SelectItem>
              <SelectItem value="Organic Farm">Organic Farm</SelectItem>
              <SelectItem value="Dairy Farm">Dairy Farm</SelectItem>
              <SelectItem value="Poultry Farm">Poultry Farm</SelectItem>
              <SelectItem value="Fish Farm">Fish Farm</SelectItem>
              <SelectItem value="Agriculture Consultant">Agriculture Consultant</SelectItem>
              <SelectItem value="Greenhouse">Greenhouse</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="md:w-1/4">
              <SelectValue placeholder="Farming Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="organic">Organic</SelectItem>
              <SelectItem value="conventional">Conventional</SelectItem>
              <SelectItem value="greenhouse">Greenhouse</SelectItem>
              <SelectItem value="dairy">Dairy</SelectItem>
              <SelectItem value="poultry">Poultry</SelectItem>
              <SelectItem value="fish">Fish Farming</SelectItem>
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
                  <div className="h-48 bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center">
                    <span className="text-white text-4xl">🌾</span>
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
                    {service.farmSize && (
                      <p><strong>Farm Size:</strong> {service.farmSize}</p>
                    )}
                    {service.experienceYears && (
                      <p><strong>Experience:</strong> {service.experienceYears} years</p>
                    )}
                    {service.farmType && (
                      <p><strong>Type:</strong> {service.farmType}</p>
                    )}
                  </div>
                  <div className="mt-4 flex gap-2 flex-wrap">
                    {service.organicFarming && <Badge variant="outline">Organic</Badge>}
                    {service.organicCertified && <Badge variant="outline">Certified</Badge>}
                    {service.seeds && <Badge variant="outline">Seeds</Badge>}
                    {service.fertilizers && <Badge variant="outline">Fertilizers</Badge>}
                    {service.deliveryAvailable && <Badge variant="outline">Delivery</Badge>}
                    {service.wholesaleAvailable && <Badge variant="outline">Wholesale</Badge>}
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