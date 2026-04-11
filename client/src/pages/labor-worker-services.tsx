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
  workerType: string;
  businessName?: string;
  workerName: string;
  skills?: string;
  experience?: string;
  age?: number;
  gender?: string;
  availability?: string;
  hourlyRate?: number;
  dailyRate?: number;
  monthlyRate?: number;
  certified?: boolean;
  backgroundVerified?: boolean;
  city?: string;
  contactPhone: string;
  images?: string[];
}

async function fetchJson(url: string) {
  const res = await fetch(url);
  const ct = res.headers.get("content-type") || "";
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  if (!ct.toLowerCase().includes("application/json")) throw new Error("Not JSON");
  return res.json();
}

export default function LaborWorkerServicesPage() {
  const [, setLocation] = useLocation();
  const [workerType, setWorkerType] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    params.set("limit", "100");
    if (workerType) params.set("workerType", workerType);
    return params.toString();
  }, [workerType]);

  const { data, isLoading, refetch } = useQuery<ServiceItem[]>({
    queryKey: ["labor-worker-services", workerType],
    queryFn: async () => fetchJson(`/api/labor-worker-services?${queryParams}`),
  });

  const filteredData = useMemo(() => {
    if (!data) return [];
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((item: ServiceItem) =>
      item.title?.toLowerCase().includes(q) ||
      item.workerName?.toLowerCase().includes(q) ||
      item.workerType?.toLowerCase().includes(q) ||
      item.skills?.toLowerCase().includes(q) ||
      item.city?.toLowerCase().includes(q)
    );
  }, [data, search]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Labor & Worker Services</h1>
            <p className="text-sm text-muted-foreground mt-1">Find skilled laborers, workers, and helpers</p>
          </div>
          <Button variant="outline" onClick={() => setLocation("/")}>Back to Home</Button>
        </div>

        <Card className="mb-6">
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
            <div className="space-y-2">
              <Label>Worker Type</Label>
              <Select value={workerType} onValueChange={(v) => setWorkerType(v === "all" ? "" : v)}>
                <SelectTrigger><SelectValue placeholder="All types" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="plumber">Plumber</SelectItem>
                  <SelectItem value="electrician">Electrician</SelectItem>
                  <SelectItem value="carpenter">Carpenter</SelectItem>
                  <SelectItem value="painter">Painter</SelectItem>
                  <SelectItem value="mason">Mason</SelectItem>
                  <SelectItem value="mechanic">Mechanic</SelectItem>
                  <SelectItem value="construction_worker">Construction Worker</SelectItem>
                  <SelectItem value="driver">Driver</SelectItem>
                  <SelectItem value="security_guard">Security Guard</SelectItem>
                  <SelectItem value="household_helper">Household Helper</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Search</Label>
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, skill..." />
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
                      <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                        {item.images && item.images[0] ? (
                          <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          <span className="text-orange-600 font-bold text-lg">{item.workerName?.[0] || "W"}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-base truncate">{item.title}</CardTitle>
                        <p className="text-sm text-muted-foreground truncate">{item.workerName}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="secondary" className="text-xs">{item.workerType}</Badge>
                      {item.certified && <Badge className="bg-green-600 text-xs">Certified</Badge>}
                      {item.backgroundVerified && <Badge className="bg-blue-600 text-xs">Verified</Badge>}
                    </div>
                    {item.skills && <div className="text-xs text-muted-foreground line-clamp-1">Skills: {item.skills}</div>}
                    {item.experience && <div className="text-xs text-muted-foreground">Experience: {item.experience}</div>}
                    {item.city && <div className="text-xs text-muted-foreground">📍 {item.city}</div>}
                    {item.contactPhone && <div className="text-xs">📞 {item.contactPhone}</div>}
                  </CardContent>
                </Card>
              ))}
            </div>
            {filteredData.length === 0 && <div className="text-center text-muted-foreground py-8">No workers found.</div>}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}