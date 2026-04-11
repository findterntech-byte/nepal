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
  teamSize?: number;
  specialization?: string;
  technologies?: string;
  hourlyRate?: number;
  isoCertified?: boolean;
  msmeRegistered?: boolean;
  city?: string;
  contactPhone: string;
  website?: string;
  images?: string[];
}

async function fetchJson(url: string) {
  const res = await fetch(url);
  const ct = res.headers.get("content-type") || "";
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  if (!ct.toLowerCase().includes("application/json")) throw new Error("Not JSON");
  return res.json();
}

export default function EngineeringITServicesPage() {
  const [, setLocation] = useLocation();
  const [category, setCategory] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    params.set("limit", "100");
    if (category) params.set("serviceCategory", category);
    return params.toString();
  }, [category]);

  const { data, isLoading, refetch } = useQuery<ServiceItem[]>({
    queryKey: ["engineering-it-services", category],
    queryFn: async () => fetchJson(`/api/engineering-it-services?${queryParams}`),
  });

  const filteredData = useMemo(() => {
    if (!data) return [];
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((item: ServiceItem) =>
      item.title?.toLowerCase().includes(q) ||
      item.businessName?.toLowerCase().includes(q) ||
      item.serviceCategory?.toLowerCase().includes(q) ||
      item.specialization?.toLowerCase().includes(q) ||
      item.technologies?.toLowerCase().includes(q) ||
      item.city?.toLowerCase().includes(q)
    );
  }, [data, search]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Engineering & IT Services</h1>
            <p className="text-sm text-muted-foreground mt-1">Find software developers, engineers, and IT consultants</p>
          </div>
          <Button variant="outline" onClick={() => setLocation("/")}>Back to Home</Button>
        </div>

        <Card className="mb-6">
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v === "all" ? "" : v)}>
                <SelectTrigger><SelectValue placeholder="All categories" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="software_development">Software Development</SelectItem>
                  <SelectItem value="web_development">Web Development</SelectItem>
                  <SelectItem value="mobile_development">Mobile Development</SelectItem>
                  <SelectItem value="ui_ux_design">UI/UX Design</SelectItem>
                  <SelectItem value="cloud_services">Cloud Services</SelectItem>
                  <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
                  <SelectItem value="data_analytics">Data Analytics</SelectItem>
                  <SelectItem value="ai_ml">AI & Machine Learning</SelectItem>
                  <SelectItem value="civil_engineering">Civil Engineering</SelectItem>
                  <SelectItem value="mechanical_engineering">Mechanical Engineering</SelectItem>
                  <SelectItem value="consulting">IT Consulting</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Search</Label>
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search business, technology..." />
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
                      <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                        {item.images && item.images[0] ? (
                          <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          <span className="text-purple-600 font-bold text-lg">{item.businessName?.[0] || "E"}</span>
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
                      {item.isoCertified && <Badge className="bg-green-600 text-xs">ISO</Badge>}
                      {item.msmeRegistered && <Badge className="bg-blue-600 text-xs">MSME</Badge>}
                    </div>
                    {item.specialization && <div className="text-xs text-muted-foreground line-clamp-1">Specialization: {item.specialization}</div>}
                    {item.technologies && <div className="text-xs text-muted-foreground line-clamp-1">Tech: {item.technologies}</div>}
                    {item.teamSize && <div className="text-xs text-muted-foreground">Team: {item.teamSize} members</div>}
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