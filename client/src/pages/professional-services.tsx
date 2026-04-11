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
  professionalName: string;
  qualification?: string;
  experienceYears?: number;
  certifications?: string;
  specialization?: string;
  serviceAreas?: string;
  hourlyRate?: number;
  consultationFee?: number;
  freeConsultation?: boolean;
  homeService?: boolean;
  onlineService?: boolean;
  emergencyService?: boolean;
  licensedProfessional?: boolean;
  insured?: boolean;
  verified?: boolean;
  contactPerson: string;
  contactPhone: string;
  contactEmail?: string;
  whatsappAvailable?: boolean;
  city?: string;
  fullAddress?: string;
  workingHours?: string;
  available24_7?: boolean;
  languagesKnown?: string;
  website?: string;
  images?: string[];
  isActive?: boolean;
}

async function fetchJson(url: string) {
  const res = await fetch(url);
  const ct = res.headers.get("content-type") || "";
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed (${res.status})`);
  }
  if (!ct.toLowerCase().includes("application/json")) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Server did not return JSON. Please restart the server (port 5000) and try again.\n\n${text.slice(0, 200)}`
    );
  }
  return res.json();
}

export default function ProfessionalServicesPage() {
  const [, setLocation] = useLocation();
  const [category, setCategory] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    params.set("limit", "100");
    if (category) params.set("serviceCategory", category);
    return params.toString();
  }, [category]);

  const { data, isLoading, isError, error, refetch } = useQuery<ServiceItem[]>({
    queryKey: ["professional-services", category],
    queryFn: async () => {
      return fetchJson(`/api/professional-services?${queryParams}`);
    },
  });

  const filteredData = useMemo(() => {
    if (!data) return [];
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((item: ServiceItem) =>
      item.title?.toLowerCase().includes(q) ||
      item.businessName?.toLowerCase().includes(q) ||
      item.professionalName?.toLowerCase().includes(q) ||
      item.serviceCategory?.toLowerCase().includes(q) ||
      item.specialization?.toLowerCase().includes(q) ||
      item.city?.toLowerCase().includes(q)
    );
  }, [data, search]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Professional Profile & Expertise</h1>
              <p className="text-sm text-muted-foreground mt-1">Find certified professionals, consultants, and experts</p>
            </div>
            <Button variant="outline" onClick={() => setLocation("/")}>Back to Home</Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v === "all" ? "" : v)}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="consulting">Consulting</SelectItem>
                  <SelectItem value="accounting">Accounting & Finance</SelectItem>
                  <SelectItem value="legal">Legal Services</SelectItem>
                  <SelectItem value="hr">HR Services</SelectItem>
                  <SelectItem value="marketing">Marketing & Advertising</SelectItem>
                  <SelectItem value="design">Design & Creative</SelectItem>
                  <SelectItem value="architecture">Architecture & Engineering</SelectItem>
                  <SelectItem value="medical">Medical & Healthcare</SelectItem>
                  <SelectItem value="education">Education & Training</SelectItem>
                  <SelectItem value="other">Other Professional Services</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Search</Label>
              <Input 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                placeholder="Search name, business, specialization..." 
              />
            </div>

            <div className="flex items-end">
              <Button className="w-full" onClick={() => refetch()}>Search</Button>
            </div>
          </CardContent>
        </Card>

        {isError && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Unable to load services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground whitespace-pre-wrap">{String((error as any)?.message || error)}</div>
              <div className="flex gap-2">
                <Button onClick={() => refetch()}>Retry</Button>
                <Button variant="outline" onClick={() => setLocation("/")}>Back</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="text-sm text-muted-foreground">Loading...</div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Total: {filteredData.length}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredData.map((item) => (
                <Card 
                  key={item.id} 
                  className="hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
                  onClick={() => setLocation(`/service-details/${item.id}`)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                        {item.images && item.images[0] ? (
                          <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          <span className="text-blue-600 font-bold text-lg">
                            {item.professionalName?.[0] || item.businessName?.[0] || "P"}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-base truncate">{item.title}</CardTitle>
                        <p className="text-sm text-muted-foreground truncate">{item.businessName}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="secondary" className="text-xs">{item.serviceCategory}</Badge>
                      {item.licensedProfessional && <Badge className="bg-green-600 text-xs">Licensed</Badge>}
                      {item.verified && <Badge className="bg-blue-600 text-xs">Verified</Badge>}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">{item.professionalName}</span>
                      {item.experienceYears && <span className="text-muted-foreground"> • {item.experienceYears} yrs</span>}
                    </div>
                    {item.specialization && (
                      <div className="text-xs text-muted-foreground line-clamp-1">Specialization: {item.specialization}</div>
                    )}
                    {item.city && <div className="text-xs text-muted-foreground">{item.city}</div>}
                    {item.contactPhone && <div className="text-xs">📞 {item.contactPhone}</div>}
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredData.length === 0 && (
              <div className="text-sm text-muted-foreground text-center py-8">
                No professional services found.
              </div>
            )}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}