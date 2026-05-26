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
  serviceType: string;
  businessName: string;
  serviceAreas?: string;
  hourlyRate?: number;
  contractAvailable?: boolean;
  emergencyService?: boolean;
  residential?: boolean;
  commercial?: boolean;
  licensed?: boolean;
  certified?: boolean;
  ecoFriendly?: boolean;
  city?: string;
  contactPhone: string;
  images?: string[];
}

async function fetchJson(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json();
}

export default function CleaningPestControlPage() {
  const [, setLocation] = useLocation();
  const [serviceType, setServiceType] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    params.set("limit", "100");
    if (serviceType) params.set("serviceType", serviceType);
    return params.toString();
  }, [serviceType]);

  const { data, isLoading, refetch } = useQuery<ServiceItem[]>({
    queryKey: ["cleaning-pest-control", serviceType],
    queryFn: async () => fetchJson(`/api/cleaning-pest-control?${queryParams}`),
  });

  const filteredData = useMemo(() => {
    if (!data) return [];
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((item: ServiceItem) =>
      item.title?.toLowerCase().includes(q) ||
      item.businessName?.toLowerCase().includes(q) ||
      item.serviceType?.toLowerCase().includes(q) ||
      item.city?.toLowerCase().includes(q)
    );
  }, [data, search]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Cleaning & Pest Control</h1>
            <p className="text-sm text-muted-foreground mt-1">Find professional cleaning and pest control services</p>
          </div>
          <Button variant="outline" onClick={() => setLocation("/")}>Back to Home</Button>
        </div>

        <Card className="mb-6">
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
            <div className="space-y-2">
              <Label>Service Type</Label>
              <Select value={serviceType} onValueChange={(v) => setServiceType(v === "all" ? "" : v)}>
                <SelectTrigger><SelectValue placeholder="All types" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="house_cleaning">House Cleaning</SelectItem>
                  <SelectItem value="office_cleaning">Office Cleaning</SelectItem>
                  <SelectItem value="commercial_cleaning">Commercial Cleaning</SelectItem>
                  <SelectItem value="deep_cleaning">Deep Cleaning</SelectItem>
                  <SelectItem value="pest_control">Pest Control</SelectItem>
                  <SelectItem value="termite_control">Termite Control</SelectItem>
                  <SelectItem value="carpet_cleaning">Carpet Cleaning</SelectItem>
                  <SelectItem value="sofa_cleaning">Sofa Cleaning</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Search</Label>
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search service, business..." />
            </div>
            <div className="flex items-end">
              <Button className="w-full" onClick={() => refetch()}>Search</Button>
            </div>
          </CardContent>
        </Card>

        {isLoading ? <div className="text-muted-foreground">Loading...</div> : (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">Total: {filteredData.length}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredData.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-all cursor-pointer" onClick={() => setLocation(`/service-details/${item.id}`)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center flex-shrink-0">
                        {item.images && item.images[0] ? (
                          <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          <span className="text-teal-600 font-bold text-lg">{item.businessName?.[0] || "C"}</span>
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
                      <Badge variant="secondary" className="text-xs">{item.serviceType}</Badge>
                      {item.residential && <Badge className="bg-blue-600 text-xs">Residential</Badge>}
                      {item.commercial && <Badge className="bg-purple-600 text-xs">Commercial</Badge>}
                      {item.emergencyService && <Badge className="bg-red-600 text-xs">Emergency</Badge>}
                      {item.licensed && <Badge className="bg-green-600 text-xs">Licensed</Badge>}
                      {item.ecoFriendly && <Badge className="bg-green-600 text-xs">Eco-Friendly</Badge>}
                    </div>
                    {item.hourlyRate && <div className="text-xs">रू {item.hourlyRate}/hr</div>}
                    {item.city && <div className="text-xs text-muted-foreground">📍 {item.city}</div>}
                    {item.contactPhone && <div className="text-xs">📞 {item.contactPhone}</div>}
                  </CardContent>
                </Card>
              ))}
            </div>
            {filteredData.length === 0 && <div className="text-center text-muted-foreground py-8">No services found.</div>}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}