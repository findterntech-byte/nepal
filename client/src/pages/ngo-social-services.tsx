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
  ngoType: string;
  organizationName: string;
  registrationNumber?: string;
  mission?: string;
  focusAreas?: string;
  targetBeneficiaries?: string;
  volunteerOpportunities?: boolean;
  donationAccepted?: boolean;
  ngoAccredited?: boolean;
  governmentRecognized?: boolean;
  city?: string;
  contactPhone: string;
  website?: string;
  images?: string[];
}

async function fetchJson(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json();
}

export default function NGOSocialServicesPage() {
  const [, setLocation] = useLocation();
  const [ngoType, setNgoType] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    params.set("limit", "100");
    if (ngoType) params.set("ngoType", ngoType);
    return params.toString();
  }, [ngoType]);

  const { data, isLoading, refetch } = useQuery<ServiceItem[]>({
    queryKey: ["ngo-social-services", ngoType],
    queryFn: async () => fetchJson(`/api/ngo-social-services?${queryParams}`),
  });

  const filteredData = useMemo(() => {
    if (!data) return [];
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((item: ServiceItem) =>
      item.title?.toLowerCase().includes(q) ||
      item.organizationName?.toLowerCase().includes(q) ||
      item.ngoType?.toLowerCase().includes(q) ||
      item.focusAreas?.toLowerCase().includes(q) ||
      item.targetBeneficiaries?.toLowerCase().includes(q) ||
      item.city?.toLowerCase().includes(q)
    );
  }, [data, search]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">NGOs & Social Services</h1>
            <p className="text-sm text-muted-foreground mt-1">Find NGOs, charitable organizations, and social services</p>
          </div>
          <Button variant="outline" onClick={() => setLocation("/")}>Back to Home</Button>
        </div>

        <Card className="mb-6">
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
            <div className="space-y-2">
              <Label>NGO Type</Label>
              <Select value={ngoType} onValueChange={(v) => setNgoType(v === "all" ? "" : v)}>
                <SelectTrigger><SelectValue placeholder="All types" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="charitable">Charitable Organization</SelectItem>
                  <SelectItem value="welfare">Welfare Association</SelectItem>
                  <SelectItem value="trust">Trust</SelectItem>
                  <SelectItem value="foundation">Foundation</SelectItem>
                  <SelectItem value="ngo">NGO</SelectItem>
                  <SelectItem value="social_service">Social Service Agency</SelectItem>
                  <SelectItem value="community">Community Organization</SelectItem>
                  <SelectItem value="nonprofit">Non-Profit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Search</Label>
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search organization, cause..." />
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
                      <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                        {item.images && item.images[0] ? (
                          <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          <span className="text-red-500 font-bold text-lg">{item.organizationName?.[0] || "N"}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-base truncate">{item.title}</CardTitle>
                        <p className="text-sm text-muted-foreground truncate">{item.organizationName}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="secondary" className="text-xs">{item.ngoType}</Badge>
                      {item.ngoAccredited && <Badge className="bg-green-600 text-xs">Accredited</Badge>}
                      {item.governmentRecognized && <Badge className="bg-blue-600 text-xs">Gov Recognized</Badge>}
                      {item.donationAccepted && <Badge className="bg-purple-600 text-xs">Donations</Badge>}
                      {item.volunteerOpportunities && <Badge className="bg-orange-600 text-xs">Volunteers</Badge>}
                    </div>
                    {item.focusAreas && <div className="text-xs text-muted-foreground line-clamp-1">Focus: {item.focusAreas}</div>}
                    {item.targetBeneficiaries && <div className="text-xs text-muted-foreground">Helps: {item.targetBeneficiaries}</div>}
                    {item.city && <div className="text-xs text-muted-foreground">📍 {item.city}</div>}
                    {item.contactPhone && <div className="text-xs">📞 {item.contactPhone}</div>}
                  </CardContent>
                </Card>
              ))}
            </div>
            {filteredData.length === 0 && <div className="text-center text-muted-foreground py-8">No NGOs found.</div>}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}