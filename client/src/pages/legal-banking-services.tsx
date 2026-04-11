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
  firmName?: string;
  specialization?: string;
  consultationFee?: number;
  freeConsultation?: boolean;
  registered?: boolean;
  notarized?: boolean;
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

export default function LegalBankingServicesPage() {
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
    queryKey: ["legal-banking-services", category],
    queryFn: async () => fetchJson(`/api/legal-banking-services?${queryParams}`),
  });

  const filteredData = useMemo(() => {
    if (!data) return [];
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((item: ServiceItem) =>
      item.title?.toLowerCase().includes(q) ||
      item.businessName?.toLowerCase().includes(q) ||
      item.firmName?.toLowerCase().includes(q) ||
      item.serviceCategory?.toLowerCase().includes(q) ||
      item.specialization?.toLowerCase().includes(q) ||
      item.city?.toLowerCase().includes(q)
    );
  }, [data, search]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Legal, Banking, Loan & Land Surveying</h1>
            <p className="text-sm text-muted-foreground mt-1">Find lawyers, banking services, loans, and land surveyors</p>
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
                  <SelectItem value="legal_services">Legal Services</SelectItem>
                  <SelectItem value="lawyer">Lawyer/Advocate</SelectItem>
                  <SelectItem value="notary">Notary Public</SelectItem>
                  <SelectItem value="banking_services">Banking Services</SelectItem>
                  <SelectItem value="loan_services">Loan Services</SelectItem>
                  <SelectItem value="financial_advisory">Financial Advisory</SelectItem>
                  <SelectItem value="land_surveying">Land Surveying</SelectItem>
                  <SelectItem value="property_verification">Property Verification</SelectItem>
                  <SelectItem value="title_search">Title Search</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Search</Label>
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, firm..." />
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
                      <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        {item.images && item.images[0] ? (
                          <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          <span className="text-indigo-600 font-bold text-lg">{item.businessName?.[0] || "L"}</span>
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
                      {item.registered && <Badge className="bg-green-600 text-xs">Registered</Badge>}
                      {item.notarized && <Badge className="bg-blue-600 text-xs">Notarized</Badge>}
                      {item.freeConsultation && <Badge className="bg-purple-600 text-xs">Free Consult</Badge>}
                    </div>
                    {item.firmName && <div className="text-xs text-muted-foreground">Firm: {item.firmName}</div>}
                    {item.specialization && <div className="text-xs text-muted-foreground line-clamp-1">Specialization: {item.specialization}</div>}
                    {item.consultationFee && <div className="text-xs">Consultation: ₹{item.consultationFee}</div>}
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