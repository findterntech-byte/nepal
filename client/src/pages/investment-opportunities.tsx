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
  investmentType: string;
  companyName: string;
  sector?: string;
  targetAmount?: number;
  minInvestment?: number;
  maxInvestment?: number;
  expectedReturn?: string;
  riskLevel?: string;
  verified?: boolean;
  governmentApproved?: boolean;
  sebiRegistered?: boolean;
  city?: string;
  contactPhone: string;
  images?: string[];
}

async function fetchJson(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json();
}

export default function InvestmentOpportunitiesPage() {
  const [, setLocation] = useLocation();
  const [investmentType, setInvestmentType] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    params.set("limit", "100");
    if (investmentType) params.set("investmentType", investmentType);
    return params.toString();
  }, [investmentType]);

  const { data, isLoading, refetch } = useQuery<ServiceItem[]>({
    queryKey: ["investment-opportunities", investmentType],
    queryFn: async () => fetchJson(`/api/investment-opportunities?${queryParams}`),
  });

  const filteredData = useMemo(() => {
    if (!data) return [];
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((item: ServiceItem) =>
      item.title?.toLowerCase().includes(q) ||
      item.companyName?.toLowerCase().includes(q) ||
      item.investmentType?.toLowerCase().includes(q) ||
      item.sector?.toLowerCase().includes(q) ||
      item.city?.toLowerCase().includes(q)
    );
  }, [data, search]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Investment Opportunities</h1>
            <p className="text-sm text-muted-foreground mt-1">Find equity, debt, and business investment opportunities</p>
          </div>
          <Button variant="outline" onClick={() => setLocation("/")}>Back to Home</Button>
        </div>

        <Card className="mb-6">
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
            <div className="space-y-2">
              <Label>Investment Type</Label>
              <Select value={investmentType} onValueChange={(v) => setInvestmentType(v === "all" ? "" : v)}>
                <SelectTrigger><SelectValue placeholder="All types" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="equity">Equity</SelectItem>
                  <SelectItem value="debt">Debt</SelectItem>
                  <SelectItem value="convertible_note">Convertible Note</SelectItem>
                  <SelectItem value="seed_round">Seed Round</SelectItem>
                  <SelectItem value="series_a">Series A</SelectItem>
                  <SelectItem value="franchise">Franchise</SelectItem>
                  <SelectItem value="business_acquisition">Business Acquisition</SelectItem>
                  <SelectItem value="real_estate">Real Estate</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Search</Label>
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search company, sector..." />
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
                      <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                        {item.images && item.images[0] ? (
                          <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          <span className="text-green-600 font-bold text-lg">{item.companyName?.[0] || "I"}</span>
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
                      <Badge variant="secondary" className="text-xs">{item.investmentType}</Badge>
                      {item.verified && <Badge className="bg-green-600 text-xs">Verified</Badge>}
                      {item.governmentApproved && <Badge className="bg-blue-600 text-xs">Gov Approved</Badge>}
                      {item.sebiRegistered && <Badge className="bg-purple-600 text-xs">SEBI</Badge>}
                    </div>
                    {item.sector && <div className="text-xs text-muted-foreground">Sector: {item.sector}</div>}
                    {item.targetAmount && <div className="text-xs">Target: रू {item.targetAmount.toLocaleString()}</div>}
                    {item.minInvestment && <div className="text-xs">Min: रू {item.minInvestment.toLocaleString()}</div>}
                    {item.expectedReturn && <div className="text-xs text-muted-foreground">ROI: {item.expectedReturn}</div>}
                    {item.riskLevel && <div className="text-xs text-muted-foreground">Risk: {item.riskLevel}</div>}
                    {item.city && <div className="text-xs text-muted-foreground">📍 {item.city}</div>}
                    {item.contactPhone && <div className="text-xs">📞 {item.contactPhone}</div>}
                  </CardContent>
                </Card>
              ))}
            </div>
            {filteredData.length === 0 && <div className="text-center text-muted-foreground py-8">No opportunities found.</div>}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}