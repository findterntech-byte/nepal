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
  organizationType: string;
  organizationName: string;
  registrationNumber?: string;
  establishedYear?: number;
  members?: number;
  branches?: number;
  sector?: string;
  minLoanAmount?: number;
  maxLoanAmount?: number;
  interestRate?: string;
  governmentRegistered?: boolean;
  rbiApproved?: boolean;
  nbfcCertified?: boolean;
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

export default function MicrofinanceCooperativePage() {
  const [, setLocation] = useLocation();
  const [orgType, setOrgType] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    params.set("limit", "100");
    if (orgType) params.set("organizationType", orgType);
    return params.toString();
  }, [orgType]);

  const { data, isLoading, refetch } = useQuery<ServiceItem[]>({
    queryKey: ["microfinance-cooperative", orgType],
    queryFn: async () => fetchJson(`/api/microfinance-cooperative?${queryParams}`),
  });

  const filteredData = useMemo(() => {
    if (!data) return [];
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((item: ServiceItem) =>
      item.title?.toLowerCase().includes(q) ||
      item.organizationName?.toLowerCase().includes(q) ||
      item.organizationType?.toLowerCase().includes(q) ||
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
            <h1 className="text-3xl font-bold">Microfinance & Cooperatives</h1>
            <p className="text-sm text-muted-foreground mt-1">Find microfinance companies, cooperatives, and credit societies</p>
          </div>
          <Button variant="outline" onClick={() => setLocation("/")}>Back to Home</Button>
        </div>

        <Card className="mb-6">
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
            <div className="space-y-2">
              <Label>Organization Type</Label>
              <Select value={orgType} onValueChange={(v) => setOrgType(v === "all" ? "" : v)}>
                <SelectTrigger><SelectValue placeholder="All types" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="microfinance_company">Microfinance Company</SelectItem>
                  <SelectItem value="nbfc">NBFC</SelectItem>
                  <SelectItem value="cooperative_bank">Cooperative Bank</SelectItem>
                  <SelectItem value="credit_society">Credit Society</SelectItem>
                  <SelectItem value="primary_agricultural_credit_society">PACS</SelectItem>
                  <SelectItem value="self_help_group">Self Help Group</SelectItem>
                  <SelectItem value="women_self_help_group">Women SHG</SelectItem>
                  <SelectItem value="farmer_producer_company">Farmer Producer Company</SelectItem>
                  <SelectItem value="housing_finance_company">Housing Finance</SelectItem>
                  <SelectItem value="startup_fund">Startup Fund</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Search</Label>
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search organization..." />
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
                      <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center flex-shrink-0">
                        {item.images && item.images[0] ? (
                          <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          <span className="text-cyan-600 font-bold text-lg">{item.organizationName?.[0] || "M"}</span>
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
                      <Badge variant="secondary" className="text-xs">{item.organizationType}</Badge>
                      {item.governmentRegistered && <Badge className="bg-green-600 text-xs">Gov Reg</Badge>}
                      {item.rbiApproved && <Badge className="bg-blue-600 text-xs">RBI</Badge>}
                      {item.nbfcCertified && <Badge className="bg-purple-600 text-xs">NBFC</Badge>}
                    </div>
                    {item.sector && <div className="text-xs text-muted-foreground">Sector: {item.sector}</div>}
                    {item.members && <div className="text-xs text-muted-foreground">Members: {item.members.toLocaleString()}</div>}
                    {item.branches && <div className="text-xs text-muted-foreground">Branches: {item.branches}</div>}
                    {item.minLoanAmount && item.maxLoanAmount && <div className="text-xs">Loan: रू {item.minLoanAmount.toLocaleString()} - रू {item.maxLoanAmount.toLocaleString()}</div>}
                    {item.interestRate && <div className="text-xs text-muted-foreground">Interest: {item.interestRate}</div>}
                    {item.city && <div className="text-xs text-muted-foreground">📍 {item.city}</div>}
                    {item.contactPhone && <div className="text-xs">📞 {item.contactPhone}</div>}
                  </CardContent>
                </Card>
              ))}
            </div>
            {filteredData.length === 0 && <div className="text-center text-muted-foreground py-8">No organizations found.</div>}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}