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
  insuranceType: string;
  companyName: string;
  agentName?: string;
  specialization?: string;
  covers?: string;
  freeQuote?: boolean;
  cashlessClaim?: boolean;
  claimAssistance?: boolean;
  city?: string;
  contactPhone: string;
  images?: string[];
}

async function fetchJson(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json();
}

export default function InsuranceServicesPage() {
  const [, setLocation] = useLocation();
  const [insuranceType, setInsuranceType] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    params.set("limit", "100");
    if (insuranceType) params.set("insuranceType", insuranceType);
    return params.toString();
  }, [insuranceType]);

  const { data, isLoading, refetch } = useQuery<ServiceItem[]>({
    queryKey: ["insurance-services", insuranceType],
    queryFn: async () => fetchJson(`/api/insurance-services?${queryParams}`),
  });

  const filteredData = useMemo(() => {
    if (!data) return [];
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((item: ServiceItem) =>
      item.title?.toLowerCase().includes(q) ||
      item.companyName?.toLowerCase().includes(q) ||
      item.insuranceType?.toLowerCase().includes(q) ||
      item.agentName?.toLowerCase().includes(q) ||
      item.covers?.toLowerCase().includes(q) ||
      item.city?.toLowerCase().includes(q)
    );
  }, [data, search]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Insurance Services</h1>
            <p className="text-sm text-muted-foreground mt-1">Find insurance agents, companies, and policies</p>
          </div>
          <Button variant="outline" onClick={() => setLocation("/")}>Back to Home</Button>
        </div>

        <Card className="mb-6">
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
            <div className="space-y-2">
              <Label>Insurance Type</Label>
              <Select value={insuranceType} onValueChange={(v) => setInsuranceType(v === "all" ? "" : v)}>
                <SelectTrigger><SelectValue placeholder="All types" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="life_insurance">Life Insurance</SelectItem>
                  <SelectItem value="health_insurance">Health Insurance</SelectItem>
                  <SelectItem value="vehicle_insurance">Vehicle Insurance</SelectItem>
                  <SelectItem value="home_insurance">Home Insurance</SelectItem>
                  <SelectItem value="travel_insurance">Travel Insurance</SelectItem>
                  <SelectItem value="business_insurance">Business Insurance</SelectItem>
                  <SelectItem value="group_insurance">Group Insurance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Search</Label>
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search company, agent..." />
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
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        {item.images && item.images[0] ? (
                          <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          <span className="text-emerald-600 font-bold text-lg">{item.companyName?.[0] || "I"}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-base truncate">{item.title}</CardTitle>
                        <p className="text-sm text-muted-foreground truncate">{item.companyName}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="secondary" className="text-xs">{item.insuranceType}</Badge>
                      {item.freeQuote && <Badge className="bg-green-600 text-xs">Free Quote</Badge>}
                      {item.cashlessClaim && <Badge className="bg-blue-600 text-xs">Cashless</Badge>}
                      {item.claimAssistance && <Badge className="bg-purple-600 text-xs">Claim Help</Badge>}
                    </div>
                    {item.agentName && <div className="text-xs">Agent: {item.agentName}</div>}
                    {item.covers && <div className="text-xs text-muted-foreground line-clamp-1">Covers: {item.covers}</div>}
                    {item.city && <div className="text-xs text-muted-foreground">📍 {item.city}</div>}
                    {item.contactPhone && <div className="text-xs">📞 {item.contactPhone}</div>}
                  </CardContent>
                </Card>
              ))}
            </div>
            {filteredData.length === 0 && <div className="text-center text-muted-foreground py-8">No insurance services found.</div>}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}