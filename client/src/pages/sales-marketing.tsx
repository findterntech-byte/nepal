import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  website?: string;
  city: string;
  state?: string;
  digitalMarketing?: boolean;
  seoServices?: boolean;
  socialMediaMarketing?: boolean;
  contentMarketing?: boolean;
  leadGeneration?: boolean;
  brandMarketing?: boolean;
  startingPrice?: number;
  hourlyRate?: number;
  teamSize?: number;
  experienceYears?: number;
  certifications?: string;
  images?: string[];
  isActive: boolean;
  isFeatured?: boolean;
}

export default function SalesMarketingPage() {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");

  const { data: services = [], isLoading } = useQuery<ServiceItem[]>({
    queryKey: ["sales-marketing-public"],
    queryFn: async () => {
      const res = await fetch("/api/sales-marketing");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesSearch = !searchQuery || 
        service.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.businessName?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || service.serviceCategory === selectedCategory;
      const matchesCity = selectedCity === "all" || service.city === selectedCity;
      return matchesSearch && matchesCategory && matchesCity && service.isActive;
    });
  }, [services, searchQuery, selectedCategory, selectedCity]);

  const cities = useMemo(() => [...new Set(services.filter(s => s.city).map(s => s.city))], [services]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Sales & Marketing Services</h1>
          <p className="text-muted-foreground">Find the best marketing agencies and sales services</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Input placeholder="Search services..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="md:w-1/3" />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="md:w-1/4"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
              <SelectItem value="SEO Services">SEO Services</SelectItem>
              <SelectItem value="Social Media Marketing">Social Media Marketing</SelectItem>
              <SelectItem value="Lead Generation">Lead Generation</SelectItem>
              <SelectItem value="Marketing Agency">Marketing Agency</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="md:w-1/4"><SelectValue placeholder="City" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {cities.map((city) => (<SelectItem key={city} value={city}>{city}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? <div className="text-center py-12">Loading...</div> : filteredServices.length === 0 ? <div className="text-center py-12 text-muted-foreground">No services found</div> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <Card key={service.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setLocation(`/sales-marketing/${service.id}`)}>
                {service.images?.length ? <div className="h-48 overflow-hidden"><img src={service.images[0]} alt={service.title} className="w-full h-full object-cover" /></div> : <div className="h-48 bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center"><span className="text-white text-4xl">📈</span></div>}
                <CardHeader>
                  <div className="flex justify-between items-start"><CardTitle className="text-lg">{service.title}</CardTitle>{service.isFeatured && <Badge variant="secondary">Featured</Badge>}</div>
                  <p className="text-sm text-muted-foreground">{service.businessName}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p><strong>Category:</strong> {service.serviceCategory}</p>
                    <p><strong>Location:</strong> {service.city}, {service.state}</p>
                    {service.startingPrice && <p><strong>Starting:</strong> ₹{service.startingPrice}</p>}
                  </div>
                  <div className="mt-4 flex gap-2 flex-wrap">
                    {service.digitalMarketing && <Badge variant="outline">Digital</Badge>}
                    {service.seoServices && <Badge variant="outline">SEO</Badge>}
                    {service.socialMediaMarketing && <Badge variant="outline">Social</Badge>}
                    {service.leadGeneration && <Badge variant="outline">Leads</Badge>}
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