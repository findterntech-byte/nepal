import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  fullAddress?: string;
  digitalMarketing?: boolean;
  seoServices?: boolean;
  socialMediaMarketing?: boolean;
  contentMarketing?: boolean;
  brandMarketing?: boolean;
  leadGeneration?: boolean;
  startingPrice?: number;
  hourlyRate?: number;
  projectBased?: boolean;
  retainerModel?: boolean;
  freeConsultation?: boolean;
  certifiedExperts?: boolean;
  guaranteedResults?: boolean;
  teamSize?: number;
  experienceYears?: number;
  certifications?: string;
  portfolio?: string;
  workingHours?: string;
  languagesKnown?: string;
  images?: string[];
  isActive: boolean;
  isFeatured?: boolean;
}

const CATEGORY_OPTIONS = [
  { value: "all", label: "All Services" },
  { value: "Graphic Design", label: "Graphic Design" },
  { value: "Web Development", label: "Web Development" },
  { value: "Digital Marketing", label: "Digital Marketing" },
] as const;

const CATEGORY_FILTERS = new Set(["Graphic Design", "Web Development", "Digital Marketing"]);

export default function GraphicDesignWebDevelopmentDigitalMarketingPage() {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");

  const { data: services = [], isLoading } = useQuery<ServiceItem[]>({
    queryKey: ["graphic-design-web-development-digital-marketing"],
    queryFn: async () => {
      const res = await fetch("/api/graphic-design-web-development-digital-marketing");
      if (!res.ok) throw new Error("Failed to fetch services");
      return res.json();
    },
  });

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const categoryMatches = CATEGORY_FILTERS.has(service.serviceCategory);
      const matchesCategory = selectedCategory === "all" || service.serviceCategory === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        service.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.serviceCategory?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCity = selectedCity === "all" || service.city === selectedCity;
      return categoryMatches && matchesCategory && matchesSearch && matchesCity && service.isActive;
    });
  }, [services, searchQuery, selectedCategory, selectedCity]);

  const cities = useMemo(() => Array.from(new Set(services.filter((s) => s.city).map((s) => s.city))), [services]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Graphic Design, Web Development & Digital Marketing</h1>
          <p className="text-muted-foreground mt-2">Browse trusted creatives, developers, and marketing experts in one place.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by service, business, or location..."
            className="lg:flex-1"
          />

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full lg:w-72">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="w-full lg:w-72">
              <SelectValue placeholder="Select city" />
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
          <div className="text-center py-12 text-muted-foreground">Loading services...</div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No services found. Try another category or search term.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <Card
                key={service.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setLocation(`/service-details/${service.id}`)}
              >
                {service.images?.[0] ? (
                  <div className="h-48 overflow-hidden rounded-t-xl">
                    <img src={service.images[0]} alt={service.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-r from-sky-500 to-purple-600 flex items-center justify-center rounded-t-xl">
                    <span className="text-white text-4xl">🎨</span>
                  </div>
                )}
                <CardHeader>
                  <div className="flex justify-between items-start gap-3">
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                    {service.isFeatured && <Badge variant="secondary">Featured</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{service.businessName}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p><strong>Category:</strong> {service.serviceCategory}</p>
                    <p><strong>Location:</strong> {service.city}{service.state ? `, ${service.state}` : ""}</p>
                    {service.startingPrice && <p><strong>Starting:</strong> रू {service.startingPrice}</p>}
                    {service.hourlyRate && <p><strong>Hourly:</strong> रू {service.hourlyRate}</p>}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {service.digitalMarketing && <Badge variant="outline">Digital Marketing</Badge>}
                    {service.seoServices && <Badge variant="outline">SEO</Badge>}
                    {service.socialMediaMarketing && <Badge variant="outline">Social Media</Badge>}
                    {service.contentMarketing && <Badge variant="outline">Content</Badge>}
                    {service.brandMarketing && <Badge variant="outline">Brand</Badge>}
                    {service.leadGeneration && <Badge variant="outline">Lead Gen</Badge>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
